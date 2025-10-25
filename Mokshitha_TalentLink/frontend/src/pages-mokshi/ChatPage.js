import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ChatPage.css";

export default function ChatPage() {
  const { contractId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(null);
 const storedName =
  localStorage.getItem("profileName") ||
  localStorage.getItem("freelancerProfileName") ||
  localStorage.getItem("clientProfileName") ||
  "User";
const profileName = storedName.trim();


  // ✅ Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/messages/");
      const filtered = res.data.filter(
        (msg) => msg.contract === parseInt(contractId)
      );
      setMessages(filtered);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // ✅ Fetch contract (to identify sender/receiver)
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/contracts/${contractId}/`)
      .then((res) => setContract(res.data))
      .catch((err) => console.error("Error fetching contract:", err));
  }, [contractId]);

  // ✅ Send message
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    if (!contract) return alert("Contract not loaded yet!");

    const receiverName =
      profileName === contract.client_name
        ? contract.freelancer_name
        : contract.client_name;

    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/messages/", {
        contract: contractId,
        sender: profileName,
        receiver: receiverName,
        content: newMessage,
      });
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto-refresh every 3 seconds
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [contractId]);

  return (
    <div className="chat-container">
      <h2>💬 Chat Room for Contract #{contractId}</h2>

      <div className="chat-box">
        {messages.length ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${
                msg.sender === profileName ? "sent" : "received"
              }`}
            >
              <div className="bubble">
                <p>{msg.content}</p>
              </div>
              <small>{msg.sender}</small>
            </div>
          ))
        ) : (
          <p className="no-msg">No messages yet.</p>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

