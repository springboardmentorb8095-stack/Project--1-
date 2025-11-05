import React, { useEffect, useState } from "react";
import MessageList from "./MessageList";
import MessageDetail from "./MessageDetail";
import API from "../api/axios";

const MessagingPage = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    API.get("/")
      .then((res) => setChats(res.data))
      .catch((err) => console.log(err));
  }, []);

  const selectChat = (chat) => setSelectedChat(chat);

  const sendMessage = (chatId, content) => {
    API.post("send/", { chat: chatId, content })
      .then((res) => {
        // Update messages in state
        const updatedChats = chats.map((c) =>
          c.id === chatId ? { ...c, messages: [...c.messages, res.data] } : c
        );
        setChats(updatedChats);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex">
      <MessageList chats={chats} selectChat={selectChat} />
      {selectedChat && <MessageDetail chat={selectedChat} sendMessage={sendMessage} />}
    </div>
  );
};

export default MessagingPage;
