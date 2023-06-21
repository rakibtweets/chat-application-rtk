import { apiSlice } from '../api/apiSlice';
import { messagesApi } from '../messages/messagesApi';

export const conversationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (email) =>
        `/conversations?participants_like=${email}&_sort=timestamp_order=desc&_page=1&_limit=${process.env.REACT_APP_CONVERSATION_PER_PAGE}`
    }),
    getConversation: builder.query({
      query: ({ userEmail, participantEmail }) =>
        `/conversations?participants_like=${userEmail}-${participantEmail}&&participants_like=${participantEmail}-${userEmail}`
    }),
    addConversation: builder.mutation({
      query: ({ sender, data }) => ({
        url: '/conversations',
        method: 'POST',
        body: data
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        // after query have done
        const conversation = await queryFulfilled;
        if (conversation?.data?.id) {
          // silent entry to message table
          const users = arg.data.users;
          const senderUser = users.find((user) => user.email === arg.sender);
          const receiverUser = users.find((user) => user.email !== arg.sender);

          dispatch(
            messagesApi.endpoints.addMessage.initiate({
              conversationId: conversation?.data?.id,
              sender: senderUser,
              receiver: receiverUser,
              message: arg.data.message,
              timestamp: arg.data.timestamp
            })
          );
        }
      }
    }),
    editConversation: builder.mutation({
      query: ({ conversationId, data, sender }) => ({
        url: `/conversations/${conversationId}`,
        method: 'PUT',
        body: data
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        // optimistic cache update start
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            'getConversations',
            arg.sender,
            (draft) => {
              const draftConversation = draft.find(
                (c) => c.id === arg.conversationId
              );

              draftConversation.message = arg?.data?.message;
              draftConversation.timestamp = arg?.data?.timestamp;
              return draft;
            }
          )
        );

        // optimistic cache update end

        // after query have done
        try {
          const conversation = await queryFulfilled;
          if (conversation?.data?.id) {
            // silent entry to message table
            const users = arg.data.users;
            const senderUser = users.find((user) => user.email === arg.sender);
            const receiverUser = users.find(
              (user) => user.email !== arg.sender
            );

            const res = await dispatch(
              messagesApi.endpoints.addMessage.initiate({
                conversationId: conversation?.data?.id,
                sender: senderUser,
                receiver: receiverUser,
                message: arg.data.message,
                timestamp: arg.data.timestamp
              })
            ).unwrap();

            // update message cache pessimistically start
            dispatch(
              messagesApi.util.updateQueryData(
                'getMessages',
                res.conversationId.toString(),
                (draft) => {
                  draft.push(res);
                }
              )
            );

            // update message cache pessimistically end
          }
        } catch (err) {
          patchResult.undo();
        }
      }
    })
  })
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useAddConversationMutation,
  useEditConversationMutation
} = conversationsApi;
