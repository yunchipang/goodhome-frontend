import React, { useState, useEffect } from "react";
import ChatButton from "../components/ChatButton";
import "./ChatPage.css";
import userProfilePic from "../assets/profile_pic_placeholder.jpg";

function ChatPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUserId = localStorage.getItem("user_id");

  const fetchChatUsers = async (currentUserId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/chat/last/?user_id=${currentUserId}`
      );
      if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchChatUsers(currentUserId)
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch chat users:", err);
        setError("Failed to load chat history.");
        setLoading(false);
      });
  }, [currentUserId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="chat-container">
        {users.length > 0 ? (
          users.map((user) => (
            <div className="chat-card" key={user.id}>
              <img src={userProfilePic} alt="User" className="profile-pic" />
              <div className="chat-info">
                <p className="user-name">{user.username}</p>
                <p className="last-message">{user.last_message}</p>
              </div>
              <ChatButton currentUserId={currentUserId} otherUserId={user.id} />
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
