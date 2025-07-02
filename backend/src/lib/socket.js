import { Server } from "socket.io";
import http from "http";
import express from "express";

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

  // Listen for sendMessage event from client
  socket.on("sendMessage", async (messageData) => {
    if (
      messageData.roomId && messageData.roomId.startsWith("ai_")
    ) {
      try {
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
        const aiMessage = {
          sender: "ConvoAI",
          text: "AI could not process your request.",
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