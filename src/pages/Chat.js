// src/Chat.js
import React, { useState, useEffect } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  let socket;

  useEffect(() => {
    // Replace 'ws://127.0.0.1:8000/ws/chat/ROOM_NAME/' with your actual WebSocket connection string
    socket = new ReconnectingWebSocket(
      "ws://127.0.0.1:8000/ws/chat/ROOM_NAME/"
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage) {
      socket.send(JSON.stringify({ message: newMessage }));
      setNewMessage("");
    }
  };

  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
