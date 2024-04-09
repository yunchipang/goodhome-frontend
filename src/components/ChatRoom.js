import React, { useState, useEffect, useRef } from "react";
import "./ChatRoom.css"; // Ensure your styles are correctly defined in this CSS file.

const ChatRoom = ({ roomId, user1Id, user2Id }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const chatSocket = useRef(null);

  // const currentUserId = localStorage.getItem("user_id")
  const currentUserId = 29; // todo: delete
  user1Id = 28;
  user2Id = 29;

  useEffect(() => {
    // Fetch chat history once when the component mounts
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/chat/history/?user1_id=${user1Id}&user2_id=${user2Id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };

    fetchChatHistory();
  }, [user1Id, user2Id]); // Depend on user IDs to refetch if they change

  useEffect(() => {
    chatSocket.current = new WebSocket(
      `ws://localhost:8000/ws/chat/${roomId}/`
    );

    chatSocket.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    chatSocket.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...data,
        },
      ]);
    };

    chatSocket.current.onclose = () => {
      console.error("Chat socket closed unexpectedly");
    };

    return () => {
      chatSocket.current.close();
    };
  }, [roomId, currentUserId]); // Reconnect WebSocket if roomId or currentUserId changes

  const sendMessage = () => {
    if (
      chatSocket.current.readyState === WebSocket.OPEN &&
      inputMessage.trim() !== ""
    ) {
      // send message
      chatSocket.current.send(
        JSON.stringify({
          sender_id: currentUserId,
          receiver_id: currentUserId === user1Id ? user2Id : user1Id,
          message: inputMessage,
        })
      );
      // reset input field after sending
      setInputMessage("");
    } else {
      console.error("WebSocket is not open. Message not sent.");
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-log" id="chat-log">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender_id === currentUserId ? "sent" : "receive"
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          className="chat-input"
          id="chat-message-input"
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyUp={handleKeyUp}
          placeholder="Type your message here..."
        />
        <button
          className="chat-submit"
          id="chat-message-submit"
          type="button"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
