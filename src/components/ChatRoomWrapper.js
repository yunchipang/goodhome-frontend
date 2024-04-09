import { useParams } from "react-router-dom";
import ChatRoom from "./ChatRoom";

// A wrapper component to extract the roomName param from the URL
const ChatRoomWrapper = () => {
  let { roomId } = useParams();
  return <ChatRoom roomId={roomId} />;
};

export default ChatRoomWrapper;
