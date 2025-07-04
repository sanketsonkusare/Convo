import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isAIThinking: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      // Add ConvoAI as the first user
      const convoAI = {
        _id: "convo-ai",
        username: "ConvoAI",
        profilepic: "/ai-avatar.png", // You can add an AI avatar image
        isAI: true
      };
      set({ users: [convoAI, ...res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      if (userId === "convo-ai") {
        // For AI, we'll store messages locally or load from localStorage
        const aiMessages = JSON.parse(localStorage.getItem("ai-messages") || "[]");
        set({ messages: aiMessages });
      } else {
        const res = await axiosInstance.get(`/message/${userId}`);
        set({ messages: res.data });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      if (selectedUser.isAI) {
        console.log("Sending AI message:", messageData);
        
        // Set AI thinking state to true
        set({ isAIThinking: true });
        
        // Handle AI message
        const userMessage = {
          _id: Date.now().toString() + "_user",
          senderId: useAuthStore.getState().authUser._id,
          receiverId: "convo-ai",
          text: messageData.text,
          image: messageData.image,
          createdAt: new Date().toISOString()
        };
        
        const updatedMessages = [...messages, userMessage];
        set({ messages: updatedMessages });
        
        // Save to localStorage
        localStorage.setItem("ai-messages", JSON.stringify(updatedMessages));
        
        // Send to AI via socket
        const socket = useAuthStore.getState().socket;
        if (socket) {
          const messageToSend = {
            text: messageData.text,
            roomId: `ai_${useAuthStore.getState().authUser._id}`,
            model: "mistralai/mistral-small-3.2-24b-instruct:free"
          };
          console.log("Emitting sendMessage:", messageToSend);
          socket.emit("sendMessage", messageToSend);
        } else {
          console.error("Socket not connected");
          set({ isAIThinking: false }); // Reset if socket fails
        }
      } else {
        // Regular user message
        const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
        set({ messages: [...messages, res.data] });
      }
    } catch (error) {
      console.error("Send message error:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
      set({ isAIThinking: false }); // Reset on error
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Clear existing listeners first
    socket.off("receiveMessage");
    socket.off("newMessage");

    if (selectedUser.isAI) {
      console.log("Subscribing to AI messages for room:", `ai_${useAuthStore.getState().authUser._id}`);
      
      // Listen for AI responses
      socket.on("receiveMessage", (aiMessage) => {
        console.log("Frontend received AI message:", aiMessage);
        
        if (aiMessage.roomId === `ai_${useAuthStore.getState().authUser._id}`) {
          // Stop thinking animation
          set({ isAIThinking: false });
          
          const aiReply = {
            _id: Date.now().toString() + "_ai",
            senderId: "convo-ai",
            receiverId: useAuthStore.getState().authUser._id,
            text: aiMessage.text,
            createdAt: new Date().toISOString()
          };
          
          const currentMessages = get().messages;
          const updatedMessages = [...currentMessages, aiReply];
          set({ messages: updatedMessages });
          
          // Save to localStorage
          localStorage.setItem("ai-messages", JSON.stringify(updatedMessages));
        }
      });
    } else {
      // Regular user messages
      socket.on("newMessage", (newMessage) => {
        const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
        if (!isMessageSentFromSelectedUser) return;

        set({
          messages: [...get().messages, newMessage],
        });
      });
    }
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("receiveMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));