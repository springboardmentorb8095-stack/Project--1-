// MessageInbox.js
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function MessageInbox() {
  const [conversations, setConversations] = useState([]);
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get("/messages/conversations/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConversations(res.data);
      } catch (err) {
        console.error("Error loading conversations:", err);
      }
    };

    fetchConversations();
  }, [token]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Messages</h2>
      {conversations.map((conv) => (
        <div
          key={conv.user_id}
          onClick={() => navigate(`/messages/${conv.user_id}`)}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            marginBottom: "1rem",
            cursor: "pointer",
            borderRadius: "8px",
          }}
        >
          <strong>{conv.username}</strong>
          <p>{conv.last_message}</p>
          <small>{new Date(conv.timestamp).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

export default MessageInbox;
