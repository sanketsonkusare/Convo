import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production" 
      ? [process.env.CLIENT_URL, "https://*.onrender.com"]
      : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling']
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
  });

  // AI message handling with better error handling
  socket.on("sendMessage", async (messageData) => {
    console.log("Received sendMessage:", messageData);
    
    if (messageData.roomId && messageData.roomId.startsWith("ai_")) {
      try {
        const axios = (await import("axios")).default;
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: messageData.model || "mistralai/mistral-small-3.2-24b-instruct:free",
            messages: [{ role: "user", content: messageData.text }]
          },
          {
            headers: {
              "Authorization": `Bearer ${process.env.OPENROUTER_API}`,
              "Content-Type": "application/json"
            },
            timeout: 30000
          }
        );

        const aiReply = response.data.choices[0].message.content;
        const aiMessage = {
          sender: "ConvoAI",
          text: aiReply,
          roomId: messageData.roomId,
          timestamp: new Date(),
        };

        io.to(messageData.roomId).emit("receiveMessage", aiMessage);
        
      } catch (err) {
        console.error("OpenRouter Error:", err.response?.data || err.message);
        const errorMessage = {
          sender: "ConvoAI",
          text: "Sorry, I'm having trouble processing your request right now. Please try again later.",
          roomId: messageData.roomId,
          timestamp: new Date(),
        };
        io.to(messageData.roomId).emit("receiveMessage", errorMessage);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };