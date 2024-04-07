import { useParams } from "react-router-dom";
import ChatRoom from "./ChatRoom";

// A wrapper component to extract the roomName param from the URL
const ChatRoomWrapper = () => {
  // Use the useParams hook from react-router-dom to access the roomName param
  let { roomName } = useParams();

  // Render the ChatRoom component, passing the roomName as a prop
  return <ChatRoom roomName={roomName} />;
};

export default ChatRoomWrapper;
