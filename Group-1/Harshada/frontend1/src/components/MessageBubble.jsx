import React from "react";

export default function MessageBubble({ message }) {
  const isMine = message.sender === localStorage.getItem("username");
  return (
    <div className={`message ${isMine ? "mine" : "theirs"}`}>
      <p>{message.text}</p>
      <span>{new Date(message.time).toLocaleTimeString()}</span>
    </div>
  );
}
