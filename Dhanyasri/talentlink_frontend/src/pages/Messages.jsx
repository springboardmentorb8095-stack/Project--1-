import React, { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import API from "../api.js";
import styles from "../styles/Messages.module.css";
import NavigationBar from "./NavigationBar";

function Messages() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null); // Track open picker per contract

  // ✅ Fetch current user (client or freelancer)
  const fetchCurrentUser = async () => {
    try {
      let res;
      try {
        res = await API.get("client-profile/");
      } catch {
        res = await API.get("freelancer-profile/");
      }
      setCurrentUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
      alert("⚠ Failed to fetch user profile. Please log in again.");
    }
  };

  // ✅ Fetch all contracts
  const fetchContracts = async () => {
    try {
      const res = await API.get("contracts/");
      setContracts(res.data);
      setLoading(false);

      // Fetch messages for each contract
      res.data.forEach((contract) => fetchMessages(contract.id));
    } catch (err) {
      console.error("Error fetching contracts:", err);
      alert("❌ Failed to fetch contracts.");
      setLoading(false);
    }
  };

  // ✅ Fetch messages by contract ID
  const fetchMessages = async (contractId) => {
    try {
      const res = await API.get(`messages/?contract=${contractId}`);
      setMessages((prev) => ({ ...prev, [contractId]: res.data }));
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // ✅ Helper to get receiver ID for each contract
  const getReceiverId = (contractId) => {
    const contract = contracts.find((c) => c.id === contractId);
    if (!contract || !currentUser) return null;

    // Compare logged-in user ID with contract participants
    return currentUser.id === contract.client_id
      ? contract.freelancer_id
      : contract.client_id;
  };

  // ✅ Send message
  const sendMessage = async (contractId) => {
    const text = newMessage[contractId]?.trim();
    if (!text) {
      alert("⚠ Please type a message before sending!");
      return;
    }

    const receiverId = getReceiverId(contractId);
    if (!receiverId) {
      alert("⚠ Cannot determine receiver. Try refreshing the page.");
      return;
    }

    try {
      await API.post("messages/", {
        contract: contractId,
        receiver: receiverId,
        text,
      });

      // Clear input and refresh messages
      setNewMessage((prev) => ({ ...prev, [contractId]: "" }));
      fetchMessages(contractId);
    } catch (err) {
      console.error("Error sending message:", err.response?.data || err);
      alert("❌ Failed to send message.");
    }
  };

  // ✅ Load on mount
  useEffect(() => {
    fetchCurrentUser();
    fetchContracts();
  }, []);

  if (loading) return <p className={styles.loading}>Loading contracts...</p>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <NavigationBar />
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>Messages 💬</h1>

        {contracts.length === 0 ? (
          <p>No contracts found.</p>
        ) : (
          contracts.map((contract) => (
            <div key={contract.id} className={styles.card}>
              <p>
                <strong>Project:</strong>{" "}
                {contract.project?.title ||
                  contract.project_title ||
                  "Untitled"}
              </p>
              <p>
                <strong>Freelancer:</strong> {contract.freelancer}
              </p>
              <p>
                <strong>Client:</strong> {contract.client}
              </p>
              <p>
                <strong>Status:</strong> {contract.status}
              </p>

              <div className={styles.messageSection}>
                <h4>Conversation</h4>

                <div className={styles.messageList}>
                  {messages[contract.id] && messages[contract.id].length > 0 ? (
                    messages[contract.id].map((msg) => (
                      <div
                        key={msg.id}
                        className={`${styles.messageBubble} ${
                          msg.sender_username === currentUser?.username
                            ? styles.sent
                            : styles.received
                        }`}
                      >
                        <span className={styles.senderName}>
                          {msg.sender_username}:{" "}
                        </span>
                        {msg.text}
                      </div>
                    ))
                  ) : (
                    <p className={styles.noMsg}>No messages yet.</p>
                  )}
                </div>

                <div className={styles.controlsRow}>
                  {/* 😊 Emoji Button */}
                  <button
                    type="button"
                    className={styles.emojiBtn}
                    onClick={() =>
                      setShowEmojiPicker(
                        showEmojiPicker === contract.id ? null : contract.id
                      )
                    }
                  >
                    😊
                  </button>

                  {/* Emoji Picker */}
                  {showEmojiPicker === contract.id && (
                    <div className={styles.emojiPicker}>
                      <EmojiPicker
                        onEmojiClick={(emojiData) => {
                          setNewMessage((prev) => ({
                            ...prev,
                            [contract.id]:
                              (prev[contract.id] || "") + emojiData.emoji,
                          }));
                          setShowEmojiPicker(null);
                        }}
                      />
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage[contract.id] || ""}
                    onChange={(e) =>
                      setNewMessage((prev) => ({
                        ...prev,
                        [contract.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendMessage(contract.id);
                    }}
                    className={styles.inputBox}
                  />

                  <button
                    type="button"
                    className={styles.sendBtn}
                    onClick={() => sendMessage(contract.id)}
                  >
                    Send 🚀
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Messages;
