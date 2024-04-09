import { useNavigate } from "react-router-dom";

const ChatButton = ({ theOtherUserId }) => {
  const navigate = useNavigate();

  const navigateToChatRoom = () => {
    const roomId = crypto.randomUUID();
    navigate(`/chat/${roomId}`, { state: { theOtherUserId } });
  };

  return (
    <button className="chat-button" onClick={navigateToChatRoom}>
      Chat with Seller
    </button>
  );
};

export default ChatButton;
