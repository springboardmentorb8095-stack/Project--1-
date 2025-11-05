import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";

const socket = io("http://localhost:5000");

export default function ChatPage({ username }) {
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("join", username);

    socket.on("contactsUpdated", ({ client, freelancer }) => {
      if (client === username || freelancer === username) {
        const contact = client === username ? freelancer : client;
        setContacts((prev) => [...new Set([...prev, contact])]);
      }
    });

    socket.on("receiveMessage", (msg) => {
      const key = [msg.sender, selectedUser].sort().join("_");
      if (key === [username, selectedUser].sort().join("_")) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.disconnect();
  }, [selectedUser]);

  const sendMessage = (text) => {
    if (selectedUser && text.trim()) {
      socket.emit("sendMessage", {
        sender: username,
        receiver: selectedUser,
        text,
      });
    }
  };

  return (
    <div className="chat-container">
      <ChatSidebar contacts={contacts} selectUser={setSelectedUser} />
      <ChatWindow selectedUser={selectedUser} messages={messages} onSend={sendMessage} />
    </div>
  );
}
