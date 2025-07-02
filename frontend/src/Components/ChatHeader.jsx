import { X } from "lucide-react";
import { useAuthStore } from "../Store/useAuthStore";
import { useChatStore } from "../Store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img 
                src={selectedUser?.isAI ? "/ai-avatar.png" : selectedUser?.profilepic || "/avatar.png"} 
                alt={selectedUser?.username} 
              />
              {/* Only show online indicator for regular users, not AI */}
              {!selectedUser?.isAI && onlineUsers.includes(selectedUser?._id) && (
                <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser?.username}</h3>
            {/* Only show status for regular users, not AI */}
            {!selectedUser?.isAI && (
              <p className="text-sm text-base-content/70">
                {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
              </p>
            )}
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;