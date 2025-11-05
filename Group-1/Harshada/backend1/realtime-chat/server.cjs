// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"], // ✅ Allow both client & freelancer
    methods: ["GET", "POST"],
  },
});

// =========================
// 🔹 In-memory storage
// =========================
let users = {}; // socket.id → username
let messages = []; // store chat history

// =========================
// 🔹 Socket Events
// =========================
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // 🟩 Handle user joining with username
  socket.on("join", (username) => {
    users[socket.id] = username;
    console.log(`👤 ${username} joined`);
    io.emit("userList", Object.values(users)); // Send updated user list to everyone
  });

  // 🟩 Load previous messages for connected user
  socket.emit("loadMessages", messages);

  // 🟦 When someone sends a private message
  socket.on("sendMessage", (data) => {
    const { sender, receiver, content, timestamp } = data;

    // Save to chat history
    messages.push({ sender, receiver, content, timestamp });

    // Find receiver’s socket ID
    const receiverSocketId = Object.keys(users).find(
      (key) => users[key] === receiver
    );

    // Send message to receiver if online
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", data);
    }

    // Also send back to sender (so it appears immediately)
    socket.emit("receiveMessage", data);
  });

  // 🔴 On disconnect
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
    delete users[socket.id];
    io.emit("userList", Object.values(users)); // update user list for others
  });
});

// =========================
// 🔹 REST Test Route
// =========================
app.get("/", (req, res) => {
  res.send("💬 Real-time Chat Server is Running...");
});

// =========================
// 🔹 Start Server
// =========================
const PORT = 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
