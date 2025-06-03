import { Server } from "socket.io";
import http from "http";
import express from "express";
import openai from "./openai.js";

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

   socket.on('sendMessage', async (messageData) => {
    io.to(messageData.roomId).emit('receiveMessage', messageData);

    // Check if message includes '@convo'
    if (
      (messageData.roomId && messageData.roomId.startsWith('ai_')) ||
      (messageData.text && messageData.text.includes('@convo'))
    ) {
      try {
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "user", content: messageData.text },
          ],
        });

        const aiReply = completion.data.choices[0].message.content;

        const aiMessage = {
          sender: 'ConvoAI',
          text: aiReply,
          roomId: messageData.roomId,
          timestamp: new Date(),
        };

        io.to(messageData.roomId).emit('receiveMessage', aiMessage);

      } catch (err) {
        console.error("OpenAI Error:", err.message);
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