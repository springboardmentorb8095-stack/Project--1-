import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function ChatThread() {
  const { userId } = useParams(); // ID of the person you're chatting with
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const token = localStorage.getItem("access");

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?.id;

  const chatContainerRef = useRef(null);

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

    fetchMessages(); // initial fetch

    const intervalId = setInterval(fetchMessages, 4000); 
    return () => clearInterval(intervalId); 
  }, [userId, token]);

  // Auto scroll to bottom when messages update
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
    <div style={{ padding: "2rem" }}>
      <h3>Chat</h3>
      <div
        ref={chatContainerRef}
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          height: "400px",
          overflowY: "scroll",
          marginBottom: "1rem",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.map((msg) => {
          const isOwnMessage = msg.sender === currentUserId;
          return (
            <div
              key={msg.id}
              style={{
                textAlign: isOwnMessage ? "right" : "left",
                marginBottom: "0.75rem",
              }}
            >
              <div
                style={{
                  backgroundColor: isOwnMessage ? "#cfe4ff" : "#eee",
                  color: "#333",
                  display: "inline-block",
                  padding: "0.6rem 1rem",
                  borderRadius: "18px",
                  maxWidth: "70%",
                  wordWrap: "break-word",
                }}
              >
                {msg.content}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#777",
                  marginTop: "0.2rem",
                }}
              >
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          style={{
            width: "80%",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            marginRight: "0.5rem",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />
        <button onClick={handleSend} style={{ padding: "0.5rem 1rem" }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatThread;
