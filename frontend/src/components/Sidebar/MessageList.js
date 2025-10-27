// src/components/Sidebar/MessageList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MessageList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.username) {
          console.warn("No user found in localStorage");
          setMessages([]);
          setLoading(false);
          return;
        }

        // Fetch messages from backend
        const res = await axios.get(
          `http://127.0.0.1:8000/api/messages/user/${user.username}/`
        );

        setMessages(res.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Poll every 10 seconds
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenChat = (conversationId) => {
    navigate(`/chat/${conversationId}`);
  };

  if (loading) {
    return (
      <div className="w-80 p-4 bg-blue-50 rounded-xl shadow-lg h-full">
        <p className="text-gray-500">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gradient-to-b from-blue-100 to-blue-50 rounded-xl p-4 shadow-lg h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-blue-800 mb-4">Messages</h2>
      {messages.length === 0 ? (
        <p className="text-gray-500">No messages yet.</p>
      ) : (
        <ul className="space-y-3">
          {messages.map((msg) => (
            <li
              key={msg.id}
              onClick={() => handleOpenChat(msg.id)}
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex-shrink-0 ${
                    msg.online ? "bg-green-400" : "bg-gray-400"
                  }`}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className="text-blue-900 font-semibold truncate">{msg.name}</p>
                  <p className="text-gray-500 text-sm truncate">{msg.lastMessage}</p>
                </div>
              </div>
              {msg.online && (
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
