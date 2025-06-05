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

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
  const { messages } = get();
  const socket = useAuthStore.getState().socket;

  try {
    socket.emit("sendMessage", messageData);

    // Optimistically update UI
    set({ messages: [...messages, messageData] });
    } catch (error) {
      toast.error("Failed to send message via socket.");
      console.error("Socket send error:", error);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("receiveMessage", (newMessage) => {
      const { selectedUser, messages } = get();
      const currentUserId = useAuthStore.getState().user._id;

      const isCurrentRoom = newMessage.roomId === selectedUser._id;
      if (!isCurrentRoom) return;

      const labeledMessage = {
        ...newMessage,
        isSender: newMessage.senderId === currentUserId,
      };

      set({ messages: [...messages, labeledMessage] });
    });

  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));