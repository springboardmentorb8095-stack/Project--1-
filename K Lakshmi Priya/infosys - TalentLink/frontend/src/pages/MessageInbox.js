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
    <div className="p-10">
      <h2 className="text-2xl font-semibold mb-4">Your Messages</h2>
      {conversations.length === 0 && (
        <p className="text-gray-500">No conversations yet.</p>
      )}
      <div className="space-y-3">
        {conversations.map((conv) => (
          <div
            key={conv.user_id}
            onClick={() => navigate(`/messages/${conv.user_id}`)}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition flex justify-between items-center"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{conv.username.charAt(0).toUpperCase() + conv.username.slice(1)}</p>
              <p className="text-gray-600 text-sm truncate">{conv.last_message}</p>
            </div>
            <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">
              {new Date(conv.timestamp).toLocaleString([], {
                hour: "2-digit",
                minute: "2-digit",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessageInbox;
