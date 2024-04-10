import { useNavigate } from "react-router-dom";

const ChatButton = ({ currentUserId, otherUserId }) => {
  const navigate = useNavigate();
  const navigateToChatRoom = () => {
    const sortedIds = [currentUserId, otherUserId]
      .sort((a, b) => a - b)
      .join("-");
    const roomId = sortedIds;
    navigate(`/chat/${roomId}`);
  };

  return (
    <button className="chat-button" onClick={navigateToChatRoom}>
      Chat
    </button>
  );
};

export default ChatButton;
