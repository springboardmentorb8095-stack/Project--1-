import React, { useState } from "react";

const MessageDetail = ({ chat, sendMessage }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text) return;
    sendMessage(chat.id, text);
    setText("");
  };

  return (
    <div className="flex flex-col w-3/4 p-4 h-screen">
      <div className="flex-1 overflow-y-auto mb-4">
        {chat.messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 my-1 rounded ${msg.sender.id === chat.current_user ? "bg-blue-200 self-end" : "bg-gray-200 self-start"}`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 border rounded-l"
          placeholder="Type your message..."
        />
        <button onClick={handleSend} className="bg-blue-500 text-white p-2 rounded-r">
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageDetail;
