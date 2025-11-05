import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./ChatWindow.css";

// Connect to backend
const socket = io("http://localhost:5000", { transports: ["websocket"] });

function ChatWindow() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")) || { username: "Guest" };
  const chatBoxRef = useRef();

  // === Join the socket and listen for events ===
  useEffect(() => {
    socket.emit("join", user.username);

    socket.on("userList", (users) => {
      setOnlineUsers(users.filter((u) => u !== user.username));
    });

    socket.on("receiveMessage", (data) => {
      // only update if it belongs to this chat
      if (
        (data.sender === user.username && data.receiver === selectedUser) ||
        (data.sender === selectedUser && data.receiver === user.username)
      ) {
        setMessages((prev) => [...prev, data]);
      }
    });

    socket.on("typing", (data) => {
      if (data.sender === selectedUser) setTypingUser(data.sender);
      setTimeout(() => setTypingUser(null), 1500);
    });

    return () => {
      socket.off("userList");
      socket.off("receiveMessage");
      socket.off("typing");
    };
  }, [selectedUser]);

  // === Load stored messages when opening a chat ===
  useEffect(() => {
    if (selectedUser) {
      const stored = localStorage.getItem(
        `chat_${user.username}_${selectedUser}`
      );
      if (stored) setMessages(JSON.parse(stored));
      else setMessages([]);
    }
  }, [selectedUser]);

  // === Auto-scroll to bottom ===
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // === Save messages locally ===
  useEffect(() => {
    if (selectedUser && messages.length > 0) {
      localStorage.setItem(
        `chat_${user.username}_${selectedUser}`,
        JSON.stringify(messages)
      );
    }
  }, [messages, selectedUser]);

  // === Handle typing event ===
  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", { sender: user.username, receiver: selectedUser });
  };

  // === Send a message ===
  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    const newMsg = {
      sender: user.username,
      receiver: selectedUser,
      content: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // send only to backend, don't push locally again (prevents duplicates)
    socket.emit("sendMessage", newMsg);
    setMessage("");
  };

  return (
    <div className="chat-wrapper">
      {/* === Sidebar === */}
      <aside className="chat-sidebar">
        <h3>💬 Chats</h3>
        {onlineUsers.length === 0 && <p>No users online</p>}
        <ul>
          {onlineUsers.map((u, i) => (
            <li
              key={i}
              className={u === selectedUser ? "active" : ""}
              onClick={() => setSelectedUser(u)}
            >
              👤 {u}
            </li>
          ))}
        </ul>
      </aside>

      {/* === Main Chat === */}
      <div className="chat-container">
        <div className="chat-header">
          <h2>
            💬 Chat with{" "}
            <span style={{ color: "#fff" }}>
              {selectedUser || "Select a user"}
            </span>
          </h2>
          <span className="user-badge">Logged in as: {user.username}</span>
        </div>

        <div className="chat-box" ref={chatBoxRef}>
          {!selectedUser && (
            <p className="no-messages">👈 Select someone to start chatting!</p>
          )}

          {selectedUser &&
            messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-bubble ${
                  msg.sender === user.username ? "sent" : "received"
                }`}
              >
                <div className="bubble-header">
                  <strong>{msg.sender}</strong>{" "}
                  <span className="timestamp">{msg.timestamp}</span>
                </div>
                <p>{msg.content}</p>
              </div>
            ))}

          {typingUser && (
            <div className="typing-indicator">{typingUser} is typing...</div>
          )}
        </div>

        {/* === Input Area === */}
        {selectedUser && (
          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={handleTyping}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="send-btn" onClick={sendMessage}>
              🚀 Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
