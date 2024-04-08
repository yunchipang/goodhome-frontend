import React, { useState, useEffect, useRef } from "react";
import "./ChatRoom.css"; // Make sure you import the CSS file

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
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    chatSocket.current.onclose = function (e) {
      console.error("Chat socket closed unexpectedly");
    };

    return () => {
      chatSocket.current.close();
    };
  }, [roomName]);

  const sendMessage = () => {
    if (chatSocket.current.readyState === WebSocket.OPEN) {
      chatSocket.current.send(JSON.stringify({ message: inputMessage }));
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
          <div key={index} className="message">
            {msg}
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
