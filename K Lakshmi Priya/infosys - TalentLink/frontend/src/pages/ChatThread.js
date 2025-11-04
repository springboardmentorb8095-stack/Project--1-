import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function ChatThread() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const token = localStorage.getItem("access");
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?.id;

  const chatContainerRef = useRef(null);

  // Fetch receiver name
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await api.get(`/users/${userId}/profile/`);
        const profileData = res.data;
        setReceiverName(profileData.full_name || `User ${userId}`);
      } catch (err) {
        console.error("Error fetching username:", err);
      }
    };

    fetchUsername();
  }, [userId]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/?user_id=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
    const intervalId = setInterval(fetchMessages, 4000); // poll every 4s
    return () => clearInterval(intervalId);
  }, [userId, token]);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      const res = await api.post(
        "/messages/",
        { receiver: userId, content: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [...prev, res.data]);
      setInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <h3 className="text-4xl font-semibold mb-4">
        {receiverName ? receiverName.charAt(0).toUpperCase() + receiverName.slice(1) : "User"}
      </h3>

      <div
        ref={chatContainerRef}
        className="bg-purple-100 flex-1 overflow-y-auto p-4 mb-4 bg-gray-100 rounded-lg space-y-3"
        style={{ maxHeight: "70vh" }}
      >
        {messages.length === 0 && (
          <p className="text-gray-500 text-center">No messages yet.</p>
        )}
        {messages.map((msg) => {
          const isOwnMessage = msg.sender === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[70%] break-words ${
                  isOwnMessage
                    ? "bg-blue-400 text-white"
                    : "bg-white text-gray-800 border border-gray-300"
                }`}
              >
                {msg.content}
                <div className="text-xs text-gray-600 mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatThread;
