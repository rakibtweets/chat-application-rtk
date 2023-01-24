import moment from 'moment';
import { useSelector } from 'react-redux';
import { useGetConversationsQuery } from '../../features/conversations/conversationsApi';
import Error from '../ui/Error';
import ChatItem from './ChatItem';
import getPartnerInfo from '../../utils/getPartnerInfo';
import gravatarUrl from 'gravatar-url';
import { Link } from 'react-router-dom';

export default function ChatItems() {
  const { user } = useSelector((state) => state.auth) || {};
  const {
    data: conversations,
    isLoading,
    isError,
    error
  } = useGetConversationsQuery(user.email);

  // decide whate to render
  let content = null;

  if (isLoading) {
    content = <li className="mt-2 text-center">Loading...</li>;
  }
  if (!isLoading && isError) {
    content = <Error message={error?.data} />;
  }
  if (!isLoading && !isError && conversations?.length > 0) {
    content = conversations.map((conversation) => {
      const { id, message, timestamp, users } = conversation;
      const partner = getPartnerInfo(users, user.email);
      return (
        <li key={id}>
          <Link to={`/inbox/${id}`}>
            <ChatItem
              avatar={gravatarUrl(partner.email, {
                size: 80
              })}
              name={partner.name}
              lastMessage={message}
              lastTime={moment(timestamp).fromNow()}
            />
          </Link>
        </li>
      );
    });
  }
  if (!isLoading && !isError && conversations?.length === 0) {
    content = <li className="mt-2 text-center">No conversations found !</li>;
  }

  return <ul>{content}</ul>;
}
