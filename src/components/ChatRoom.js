import React, { useState, useEffect, useRef } from "react";

const ChatRoom = ({ roomName }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const chatSocket = useRef(null);

  useEffect(() => {
    // chatSocket.current = new WebSocket(
    //   `ws://${window.location.host}/ws/chat/${roomName}/`
    // );
    chatSocket.current = new WebSocket(
      `ws://localhost:8000/ws/chat/${roomName}/`
    );

    chatSocket.current.onopen = function (e) {
      console.log("WebSocket connection established");
      // Here, you can also handle queued messages if any
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
      // Connection is open
      chatSocket.current.send(JSON.stringify({ message: inputMessage }));
      setInputMessage("");
    } else {
      console.error("WebSocket is not open. Message not sent.");
      // Optionally, handle this case by retrying or informing the user
    }
  };

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      // Enter key
      sendMessage();
    }
  };

  return (
    <div>
      <textarea
        id="chat-log"
        cols="100"
        rows="20"
        readOnly
        value={messages.join("\n")}
      ></textarea>
      <br />
      <input
        id="chat-message-input"
        type="text"
        size="100"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyUp={handleKeyUp}
      />
      <br />
      <input
        id="chat-message-submit"
        type="button"
        value="Send"
        onClick={sendMessage}
      />
    </div>
  );
};

export default ChatRoom;
