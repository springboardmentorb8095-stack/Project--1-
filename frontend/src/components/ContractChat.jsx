import React, { useEffect, useState } from "react";
import axios from "axios";

const ContractChat = ({ contract }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchMessages();

    // Polling every 3 seconds
    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [contract]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/contracts/${contract.id}/messages/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSend = async () => {
    if (newMessage.trim() === "") return;
    try {
      await axios.post(
        `http://localhost:8000/api/contracts/${contract.id}/messages/send/`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
      <h3>Chat with {contract.freelancer.username === "Guest" ? contract.client.username : contract.freelancer.username}</h3>
      <div style={{ maxHeight: "400px", overflowY: "auto", marginBottom: "10px" }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ margin: "5px 0", textAlign: msg.sender.username === contract.client.username ? "left" : "right" }}>
            <span style={{ background: "#eee", padding: "5px 10px", borderRadius: "12px", display: "inline-block" }}>
              <strong>{msg.sender.username}: </strong>{msg.content}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ flex: 1, padding: "6px 10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <button onClick={handleSend} style={{ padding: "6px 12px", cursor: "pointer" }}>Send</button>
      </div>
    </div>
  );
};

export default ContractChat;
