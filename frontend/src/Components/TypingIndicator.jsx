const TypingIndicator = ({ selectedUser }) => {
  return (
    <div className="chat chat-start">
      <div className="chat-image avatar">
        <div className="size-10 rounded-full border">
          <img
            src={selectedUser?.isAI ? "/ai-avatar.png" : selectedUser?.profilepic || "/avatar.png"}
            alt="profile pic"
          />
        </div>
      </div>
      <div className="chat-header mb-1">
        <span className="text-xs opacity-50 ml-1">
          {selectedUser?.isAI ? "ConvoAI is thinking..." : "typing..."}
        </span>
      </div>
      <div className="chat-bubble bg-gradient-to-r from-purple-500 to-blue-500 text-white">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm ml-2">Thinking...</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;