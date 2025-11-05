import React from "react";

export default function ChatSidebar({ contacts, selectUser }) {
  return (
    <div className="sidebar">
      <h3>💬 Chats</h3>
      {contacts.length === 0 ? (
        <p>No contacts yet</p>
      ) : (
        contacts.map((user, i) => (
          <div
            key={i}
            onClick={() => selectUser(user)}
            className="contact-item"
          >
            {user}
          </div>
        ))
      )}
    </div>
  );
}
