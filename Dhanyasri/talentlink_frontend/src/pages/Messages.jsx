import React, { useEffect, useState } from "react";
import API from "../api.js";
import styles from "../styles/Dashboard.module.css";
import NavigationBar from "./NavigationBar";

function Messages() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState({}); // { contractId: [messages] }
  const [newMessage, setNewMessage] = useState({}); // { contractId: "message text" }

  // Fetch all contracts for the user
  const fetchContracts = async () => {
    try {
      const res = await API.get("contracts/");
      setContracts(res.data);
      setLoading(false);

      // Fetch messages for each contract
      res.data.forEach((contract) => fetchMessages(contract.id));
    } catch (err) {
      console.error(err);
      alert("❌ Failed to fetch contracts. Make sure you are logged in.");
      setLoading(false);
    }
  };

  // Fetch messages for a contract
  const fetchMessages = async (contractId) => {
    try {
      const res = await API.get(`messages/?contract=${contractId}`);
      setMessages((prev) => ({ ...prev, [contractId]: res.data }));
    } catch (err) {
      console.error(err);
      alert("❌ Failed to fetch messages.");
    }
  };

  // Send a new message
  const sendMessage = async (contractId) => {
    if (!newMessage[contractId] || newMessage[contractId].trim() === "") return;

    try {
      await API.post("messages/", {
        contract: contractId,
        message_text: newMessage[contractId],
      });
      setNewMessage((prev) => ({ ...prev, [contractId]: "" }));
      fetchMessages(contractId); // Refresh messages
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send message.");
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  if (loading) return <p className={styles.loading}>Loading contracts...</p>;

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <NavigationBar />
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        <h1>Messages</h1>
        {contracts.length === 0 ? (
          <p>No contracts found.</p>
        ) : (
          contracts.map((contract) => (
            <div key={contract.id} className={styles.card}>
              <p><strong>Project:</strong> {contract.project_title}</p>
              <p><strong>Freelancer:</strong> {contract.freelancer}</p>
              <p><strong>Client:</strong> {contract.client}</p>
              <p><strong>Status:</strong> {contract.status}</p>

              {/* Messages Section */}
              <div className={styles.messageSection}>
                <h4>Messages</h4>
                <div className={styles.messageList}>
                  {messages[contract.id] && messages[contract.id].length > 0 ? (
                    messages[contract.id].map((msg) => (
                      <p key={msg.id}>
                        <strong>{msg.sender}:</strong> {msg.message_text}
                      </p>
                    ))
                  ) : (
                    <p>No messages yet.</p>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage[contract.id] || ""}
                  onChange={(e) =>
                    setNewMessage((prev) => ({ ...prev, [contract.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage(contract.id);
                  }}
                />
                <button onClick={() => sendMessage(contract.id)}>Send</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Messages;
