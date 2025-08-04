import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Message } from "../../../hooks/useChat";
import { copyToClipboard, shareContent } from "../../../utils/clipboard";
import { LoadingMessage, SingleMessage } from "./components";

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
  playingMessageIndex: number | null;
  playMessageAudio: (content: string, messageIndex: number) => void;
  downloadMessage: (content: string, messageIndex: number) => void;
  streamingMessageIndex?: number | null;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  loading,
  playingMessageIndex,
  playMessageAudio,
  downloadMessage,
  streamingMessageIndex = null,
}) => {
  const { user } = useAuth();

  // Copy message content to clipboard
  const copyMessageContent = async (content: string) => {
    await copyToClipboard(content, "Message copied to clipboard!");
  };

  // Share message content
  const shareMessageContent = async (content: string) => {
    await shareContent({
      title: "AI Assistant Response",
      text: content,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-4 lg:space-y-6 p-4 lg:p-6 pb-4">
        {/* Render Messages */}
        {messages.map((message, index) => (
          <SingleMessage
            key={`${message.role}-${index}`}
            message={message}
            messageIndex={index}
            user={user}
            playingMessageIndex={playingMessageIndex}
            streamingMessageIndex={streamingMessageIndex}
            onCopy={copyMessageContent}
            onShare={shareMessageContent}
            onPlayAudio={playMessageAudio}
            onDownload={downloadMessage}
          />
        ))}

        {/* Loading Indicator */}
        {loading && <LoadingMessage />}
      </div>
    </div>
  );
};

export default ChatMessages;
