import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  conversationsApi,
  useAddConversationMutation,
  useEditConversationMutation
} from '../../features/conversations/conversationsApi';
import { useGetUserQuery } from '../../features/users/usersApi';
import isValidateEmail from '../../utils/isValidEmail';
import Error from '../ui/Error';

export default function Modal({ open, control }) {
  const [sendTo, setSendTo] = useState('');
  const [message, setMessage] = useState('');
  const [userCheck, setUserCheck] = useState(false);
  const [resError, setResError] = useState('');
  const [conversation, setConversation] = useState(undefined);
  const dispatch = useDispatch();

  const { user: loggedInUser } = useSelector((state) => state.auth) || {};

  const { email: myEmail } = loggedInUser || {};

  const { data: participant } = useGetUserQuery(sendTo, {
    skip: !userCheck
  });

  const formReset = () => {
    setMessage('');
    setSendTo('');
  };

  // add conversation
  const [addConversation, { isSuccess: isAddConversationSuccess }] =
    useAddConversationMutation();

  const [editConversation, { isSuccess: isEditConversationSuccess }] =
    useEditConversationMutation();

  useEffect(() => {
    if (participant?.length > 0 && participant[0]?.email !== myEmail) {
      //check conversation existence
      dispatch(
        conversationsApi.endpoints.getConversation.initiate({
          userEmail: myEmail,
          participantEmail: sendTo
        })
      )
        .unwrap()
        .then((data) => {
          setConversation(data);
        })
        .catch((err) => {
          setResError('There was an error');
        });
    }
  }, [participant, myEmail, dispatch, sendTo]);

  // listen conversation add/edit success
  useEffect(() => {
    if (isAddConversationSuccess || isEditConversationSuccess) {
      control();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddConversationSuccess, isEditConversationSuccess]);

  // Js denounce method: api will call when typing stopped
  const debounceHandler = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };
  // search input value
  const doSearch = (value) => {
    if (isValidateEmail(value)) {
      // check user api'
      setSendTo(value);
      setUserCheck(true);
    }
  };

  const handleSearch = debounceHandler(doSearch, 50);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (conversation?.length > 0) {
      // edit conversation
      editConversation({
        sender: myEmail,
        conversationId: conversation[0].id,
        data: {
          participants: `${myEmail}-${participant[0].email}`,
          users: [loggedInUser, participant[0]],
          message,
          timestamp: new Date().getTime()
        }
      });
    }
    if (conversation?.length === 0) {
      // add conversation
      addConversation({
        sender: myEmail,
        data: {
          participants: `${myEmail}-${participant[0].email}`,
          users: [loggedInUser, participant[0]],
          message,
          timestamp: new Date().getTime()
        }
      });
    }
    formReset();
  };

  return (
    open && (
      <>
        <div
          onClick={control}
          className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
        ></div>
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Send message
          </h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* <input type="hidden" name="remember" value="true" /> */}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="to" className="sr-only">
                  To
                </label>
                <input
                  id="to"
                  name="to"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Send to"
                  type="email"
                  value={sendTo}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                disabled={
                  conversation === undefined ||
                  (participant?.length > 0 && participant[0].email === myEmail)
                }
              >
                Send Message
              </button>
            </div>

            {participant?.length === 0 && (
              <Error message="This user doesn't exist !" />
            )}
            {participant?.length > 0 && participant[0].email === myEmail && (
              <Error message="You can not sent message to yourself" />
            )}
            {resError && <Error message={resError} />}
          </form>
        </div>
      </>
    )
  );
}
