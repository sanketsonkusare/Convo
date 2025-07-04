import { useChatStore } from "../Store/useChatStore";
import { useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import TypingIndicator from "./TypingIndicator";
import { useAuthStore } from "../Store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    isAIThinking, // Add this
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && (messages || isAIThinking)) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAIThinking]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilepic || "/avatar.png"
                      : selectedUser.isAI
                      ? "/ai-avatar.png"
                      : selectedUser.profilepic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className={`chat-bubble flex flex-col ${
              selectedUser.isAI && message.senderId === "convo-ai" 
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" 
                : ""
            }`}>
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && (
                <div className="prose prose-sm max-w-none">
                  {selectedUser.isAI && message.senderId === "convo-ai" ? (
                    <ReactMarkdown
                      components={{
                        h1: ({children}) => <h1 className="text-lg font-bold text-white mb-2">{children}</h1>,
                        h2: ({children}) => <h2 className="text-base font-bold text-white mb-2">{children}</h2>,
                        h3: ({children}) => <h3 className="text-sm font-bold text-white mb-1">{children}</h3>,
                        p: ({children}) => <p className="text-white mb-2">{children}</p>,
                        strong: ({children}) => <strong className="font-bold text-white">{children}</strong>,
                        em: ({children}) => <em className="italic text-white">{children}</em>,
                        ul: ({children}) => <ul className="list-disc list-inside text-white mb-2">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside text-white mb-2">{children}</ol>,
                        li: ({children}) => <li className="text-white">{children}</li>,
                        blockquote: ({children}) => <blockquote className="border-l-4 border-white pl-4 italic text-white">{children}</blockquote>,
                        code: ({children}) => <code className="bg-black bg-opacity-20 px-1 py-0.5 rounded text-white">{children}</code>,
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  ) : (
                    <p>{message.text}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Show typing indicator when AI is thinking */}
        {isAIThinking && selectedUser?.isAI && (
          <TypingIndicator selectedUser={selectedUser} />
        )}
        
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
