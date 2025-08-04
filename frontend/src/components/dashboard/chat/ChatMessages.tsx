import React, { useEffect, useRef } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Message } from "../../../hooks/useChat";
import { copyToClipboard, shareContent } from "../../../utils/clipboard";
import TypingIndicator from "../../TypingIndicator";
import { SingleMessage } from "./components";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
    <div className="flex-1 overflow-y-auto scrollbar-thin pb-32">
      <div className="min-h-full flex flex-col justify-end">
        <div className="space-y-1 p-4 md:p-6 pb-4">
          {/* Welcome message if no messages */}
          {messages.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-slate-100/10 to-slate-200/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 border border-white/10">
                <svg
                  className="w-8 h-8 text-cyan-400 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white/80 mb-2">
                Start a conversation
              </h3>
              <p className="text-sm text-white/60">
                Ask me anything - I'm here to help!
              </p>
            </div>
          )}

          {/* Render Messages */}
          {messages.map((message, index) => (
            <SingleMessage
              key={`${message.role}-${index}-${message.content.substring(
                0,
                20
              )}`}
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

          {/* Typing Indicator */}
          {loading && <TypingIndicator />}

          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
