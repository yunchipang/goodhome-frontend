import React, { useState, useEffect, useRef } from "react";
import "./ChatRoom.css";

const ChatRoom = ({ roomName }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const chatSocket = useRef(null);

  useEffect(() => {
    chatSocket.current = new WebSocket(
      `ws://localhost:8000/ws/chat/${roomName}/`
    );

    chatSocket.current.onopen = function (e) {
      console.log("WebSocket connection established");
    };

    chatSocket.current.onmessage = function (e) {
      const data = JSON.parse(e.data);
      // only add the message to the state if it's not the one that was sent by the current user
      if (!data.tempId || messages.every((msg) => msg.tempId !== data.tempId)) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { message: data.message, isSentByCurrentUser: false },
        ]);
      }
    };

    chatSocket.current.onclose = function (e) {
      console.error("Chat socket closed unexpectedly");
    };

    return () => {
      chatSocket.current.close();
    };
  }, [roomName, messages]); // added messages as a dependency here

  const sendMessage = () => {
    if (
      chatSocket.current.readyState === WebSocket.OPEN &&
      inputMessage.trim() !== ""
    ) {
      const tempId = new Date().getTime(); // using timestamp as a unique identifier
      const messageObject = {
        message: inputMessage,
        isSentByCurrentUser: true,
        tempId, // temporary identifier added here
      };
      chatSocket.current.send(
        JSON.stringify({ message: inputMessage, tempId })
      );
      setMessages((prevMessages) => [...prevMessages, messageObject]);
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
              msg.isSentByCurrentUser ? "sent" : "received"
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
