// src/components/Chat/ChatWindow.js
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ChatWindow() {
  const { conversationId } = useParams(); // from /chat/:conversationId
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedInUser);
  }, []);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/api/messages/${conversationId}/`);
      setMessages(res.data);
      scrollToBottom();
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Poll every 5 seconds for new messages
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [conversationId]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Send new message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(`/api/messages/${conversationId}/send/`, {
        sender: user.username,
        content: newMessage.trim(),
      });
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-50 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-blue-800">Conversation</h2>

      <div className="flex-1 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 p-2 rounded-lg max-w-xs ${
                msg.sender === user.username ? "bg-blue-500 text-white ml-auto" : "bg-white text-gray-800"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 rounded-lg border border-gray-300 outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}
