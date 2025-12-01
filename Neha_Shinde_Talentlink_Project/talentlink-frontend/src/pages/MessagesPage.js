import React, { useEffect, useState, useRef, useMemo } from 'react';
import axios from 'axios';

function MessagesPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem('access');
  const headers = useMemo(() => ({
    Authorization: `Bearer ${token}`
  }), [token]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/users/', { headers })
      .then(res => setUsers(res.data))
      .catch(err => console.error('Error fetching users:', err));
  }, [headers]);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchOrCreateConversation = async () => {
      try {
        const res = await axios.post(
          'http://127.0.0.1:8000/api/conversations/get_or_create/',
          { participant_id: selectedUser.id },
          { headers }
        );
        setConversationId(res.data.id);
      } catch (err) {
        console.error('Error getting conversation:', err);
      }
    };

    fetchOrCreateConversation();
  }, [selectedUser, headers]);

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/conversations/${conversationId}/messages/`,
          { headers }
        );
        setMessages(res.data);
        await axios.patch(
          `http://127.0.0.1:8000/api/conversations/${conversationId}/mark_read/`,
          {},
          { headers }
        );
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [conversationId, headers]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/messages/',
        {
          conversation: conversationId,
          receiver: selectedUser.id,
          content: newMessage,
        },
        { headers }
      );
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const styles = {
    wrapper: {
      display: 'flex',
      height: 'calc(100vh - 80px)',
      fontFamily: 'Segoe UI, sans-serif',
    },
    sidebar: {
      width: '240px',
      background: '#1f2937',
      color: '#fff',
      padding: '20px',
      overflowY: 'auto',
    },
    userItem: (isActive) => ({
      padding: '10px',
      cursor: 'pointer',
      borderBottom: '1px solid #374151',
      backgroundColor: isActive ? '#374151' : 'transparent',
      fontWeight: isActive ? '600' : 'normal',
      borderRadius: '6px',
    }),
    chatBox: {
      flex: 1,
      background: '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
    },
    messages: {
      flex: 1,
      overflowY: 'auto',
      marginBottom: '20px',
      display: 'flex',
      flexDirection: 'column',
    },
    messageBubble: (isSender, isRead) => ({
      alignSelf: isSender ? 'flex-end' : 'flex-start',
      background: isSender ? '#c4b5fd' : '#e5e7eb',
      padding: '10px',
      borderRadius: '8px',
      marginBottom: '10px',
      maxWidth: '70%',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      opacity: isRead || isSender ? 1 : 0.6,
    }),
    timestamp: {
      fontSize: '0.75rem',
      color: '#6b7280',
      marginTop: '4px',
    },
    inputRow: {
      display: 'flex',
      gap: '10px',
    },
    input: {
      flex: 1,
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #ccc',
    },
    button: {
      padding: '10px 16px',
      background: '#4c1d95',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.sidebar}>
        <h4>Contacts</h4>
        {users.map((user) => (
          <div
            key={user.id}
            style={styles.userItem(selectedUser?.id === user.id)}
            onClick={() => setSelectedUser(user)}
          >
            {user.username}
          </div>
        ))}
      </div>

      <div style={styles.chatBox}>
        {selectedUser ? (
          <>
            <h5>Chat with {selectedUser.username}</h5>
            <div style={styles.messages}>
              {messages.map((msg) => {
                const isSender = msg.sender !== selectedUser.id;
                return (
                  <div key={msg.id} style={styles.messageBubble(isSender, msg.read)}>
                    <div>{msg.content}</div>
                    <div style={styles.timestamp}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div style={styles.inputRow}>
              <input
                style={styles.input}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button style={styles.button} onClick={sendMessage}>
                Send
              </button>
            </div>
          </>
        ) : (
          <p>Select a user to start chatting.</p>
        )}
      </div>
    </div>
  );
}

export default MessagesPage;
