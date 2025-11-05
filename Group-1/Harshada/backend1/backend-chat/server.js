import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend URL
    methods: ["GET", "POST"],
  },
});

// Store connected users and contacts
let users = {}; // { socketId: username }
let contacts = {}; // { username: Set(otherUsernames) }
let messages = {}; // { chatKey: [ { sender, text, time } ] }

// Helper to create a unique chat ID for any pair
function getChatKey(u1, u2) {
  return [u1, u2].sort().join("_");
}

// --- SOCKET.IO EVENTS ---
io.on("connection", (socket) => {
  console.log("🟢 New connection:", socket.id);

  socket.on("join", (username) => {
    users[socket.id] = username;
    console.log(`✅ ${username} joined chat`);
    io.emit("userList", Object.values(users));
  });

  socket.on("sendMessage", (data) => {
    const { sender, receiver, text } = data;
    const chatKey = getChatKey(sender, receiver);
    const message = { sender, text, time: new Date().toISOString() };

    if (!messages[chatKey]) messages[chatKey] = [];
    messages[chatKey].push(message);

    io.emit("receiveMessage", { chatKey, ...message });
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    delete users[socket.id];
    io.emit("userList", Object.values(users));
    console.log(`🔴 ${username} disconnected`);
  });
});

// --- ADD CONTACT ENDPOINT ---
app.post("/addContact", (req, res) => {
  const { client, freelancer } = req.body;

  if (!contacts[client]) contacts[client] = new Set();
  if (!contacts[freelancer]) contacts[freelancer] = new Set();

  contacts[client].add(freelancer);
  contacts[freelancer].add(client);

  io.emit("contactsUpdated", { client, freelancer });
  console.log(`🤝 Contact linked: ${client} ↔ ${freelancer}`);
  res.json({ success: true });
});

// --- GET CONTACTS ENDPOINT ---
app.get("/contacts/:username", (req, res) => {
  const username = req.params.username;
  const userContacts = contacts[username]
    ? Array.from(contacts[username])
    : [];
  res.json(userContacts);
});

app.get("/", (req, res) => res.send("Chat backend running ✅"));

const PORT = 5000;
server.listen(PORT, () => console.log(`🚀 Chat server running on port ${PORT}`));
