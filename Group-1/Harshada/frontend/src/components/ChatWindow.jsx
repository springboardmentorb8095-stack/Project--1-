import React, { useState } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ selectedUser, messages, onSend }) {
  const [text, setText] = useState("");

  if (!selectedUser) {
    return <div className="chat-window">👋 Select someone to chat with</div>;
  }

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className="chat-window">
      <h4>Chat with {selectedUser}</h4>
      <div className="messages">
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
