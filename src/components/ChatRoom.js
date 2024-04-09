import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import "./ChatRoom.css";

const ChatRoom = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const chatSocket = useRef(null);

  // const currentUserId = localStorage.getItem("user_id")
  const currentUserId = 29; // to delete
  const [searchParams] = useSearchParams();
  const theOtherUserId = searchParams.get("theOtherUserId");

  console.log("theOtherUserId", theOtherUserId);

  useEffect(() => {
    // fetch chat history once when the component mounts
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/chat/history/?user1_id=${currentUserId}&user2_id=${theOtherUserId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const transformedData = data.map((message) => ({
          message: message.message,
          isSentByCurrentUser: message.sender_id === currentUserId,
        }));
        setMessages(transformedData);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };

    fetchChatHistory();
  }, [currentUserId, theOtherUserId]);

  useEffect(() => {
    chatSocket.current = new WebSocket(
      `ws://localhost:8000/ws/chat/${roomId}/`
    );

    chatSocket.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    chatSocket.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("Received WebSocket message:", data);

      const isSentByCurrentUser = messages.some(
        (msg) => msg.tempId === data.tempId
      );

      setMessages((prevMessages) => [
        ...prevMessages.filter((msg) => msg.tempId !== data.tempId),
        {
          ...data,
          isSentByCurrentUser,
        },
      ]);
    };

    chatSocket.current.onclose = () => {
      console.error("Chat socket closed unexpectedly");
    };

    return () => {
      chatSocket.current.close();
    };
  }, [roomId, currentUserId, messages]);

  const sendMessage = () => {
    if (
      chatSocket.current.readyState === WebSocket.OPEN &&
      inputMessage.trim() !== ""
    ) {
      const tempId = new Date().getTime();
      const messageObject = {
        sender_id: currentUserId,
        receiver_id:
          currentUserId === theOtherUserId ? currentUserId : theOtherUserId,
        message: inputMessage,
        tempId,
      };
      chatSocket.current.send(JSON.stringify(messageObject));
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...messageObject,
          isSentByCurrentUser: true,
        },
      ]);
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
              msg.isSentByCurrentUser ? "sent" : "receive"
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
