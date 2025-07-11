import { Server } from "socket.io";
import http from "http";
import express from "express";
import { queryHuggingFace } from "./hugggingface.js";


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle room joining for AI chats
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
  });

  // Listen for sendMessage event from client
  socket.on("sendMessage", async (messageData) => {
    console.log("Received sendMessage:", messageData); // Debug log
    
    if (messageData.roomId && messageData.roomId.startsWith("ai_")) {
      try {
        console.log("Processing AI message for room:", messageData.roomId); // Debug log
        
        const axios = (await import("axios")).default;
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: messageData.model || "mistralai/mistral-small-3.2-24b-instruct:free",
            messages: [
              { role: "user", content: messageData.text }
            ]
          },
          {
            headers: {
              "Authorization": `Bearer ${process.env.OPENROUTER_API}`,
              "Content-Type": "application/json"
            }
          }
        );

        console.log("OpenRouter response:", response.data); // Debug log

        const aiReply = response.data.choices[0].message.content;

        const aiMessage = {
          sender: "ConvoAI",
          text: aiReply,
          roomId: messageData.roomId,
          timestamp: new Date(),
        };

        console.log("Sending AI response to room:", messageData.roomId, aiMessage); // Debug log
        io.to(messageData.roomId).emit("receiveMessage", aiMessage);

      } catch (err) {
        console.error("OpenRouter Error:", err.response?.data || err.message);
        console.error("Full error:", err); // More detailed error log
        
        const aiMessage = {
          sender: "ConvoAI",
          text: "Sorry, I'm having trouble processing your request right now. Please try again later.",
          roomId: messageData.roomId,
          timestamp: new Date(),
        };
        io.to(messageData.roomId).emit("receiveMessage", aiMessage);
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