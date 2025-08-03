import React from "react";
import { Chat, Message } from "../../../hooks/useChat";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

interface ChatAreaProps {
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  showSettings: boolean;
  playingMessageIndex: number | null;
  streamingMessageIndex: number | null;
  playMessageAudio: (content: string, messageIndex: number) => void;
  onSendMessage: (message: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  currentChat,
  messages,
  loading,
  showSettings,
  playingMessageIndex,
  streamingMessageIndex,
  playMessageAudio,
  onSendMessage,
}) => {
  return (
    <div
      className={`flex-1 flex flex-col h-screen bg-gradient-to-br from-[#030637] via-[#1a1a2e] to-[#16213e] backdrop-blur-xl transition-all duration-300 ${
        showSettings ? "lg:mr-96" : "mr-0"
      } ml-64 lg:ml-80`}
    >
      <ChatHeader currentChat={currentChat} messagesCount={messages.length} />

      <ChatMessages
        messages={messages}
        loading={loading}
        playingMessageIndex={playingMessageIndex}
        streamingMessageIndex={streamingMessageIndex}
        playMessageAudio={playMessageAudio}
      />

      <div className="p-4 lg:p-6">
        <ChatInput loading={loading} onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default ChatArea;
