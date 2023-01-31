import { apiSlice } from '../api/apiSlice';

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
      query: (data) => ({
        url: '/conversations',
        method: 'POST',
        body: data
      })
    }),
    editConversation: builder.mutation({
      query: ({ conversationId, data }) => ({
        url: `/conversations/${conversationId}`,
        method: 'PUT',
        body: data
      })
    })
  })
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useAddConversationMutation,
  useEditConversationMutation
} = conversationsApi;
