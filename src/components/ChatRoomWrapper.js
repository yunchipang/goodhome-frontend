import { useParams } from "react-router-dom";
import ChatRoom from "./ChatRoom";

// a wrapper component to extract the roomName param from the URL
const ChatRoomWrapper = () => {
  let { roomId } = useParams();
  return <ChatRoom roomId={roomId} />;
};

export default ChatRoomWrapper;
