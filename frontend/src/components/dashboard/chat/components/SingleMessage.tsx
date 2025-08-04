import { MessageCircle } from "lucide-react";
import React from "react";
import { Message } from "../../../../hooks/useChat";
import MarkdownMessage from "../../../MarkdownMessage";
import MessageActions from "./MessageActions";

interface SingleMessageProps {
  message: Message;
  messageIndex: number;
  user: any;
  playingMessageIndex: number | null;
  streamingMessageIndex?: number | null;
  onCopy: (content: string) => void;
  onShare: (content: string) => void;
  onPlayAudio: (content: string, messageIndex: number) => void;
  onDownload: (content: string, messageIndex: number) => void;
}

const SingleMessage: React.FC<SingleMessageProps> = ({
  message,
  messageIndex,
  user,
  playingMessageIndex,
  onCopy,
  onShare,
  onPlayAudio,
  onDownload,
}) => {
  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      } group`}
    >
      <div
        className={`flex items-start space-x-2 lg:space-x-4 max-w-3xl lg:max-w-4xl ${
          message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        {/* Avatar */}
        {message.role === "assistant" && (
          <div className="bg-gradient-to-br from-[#00f5ff]/20 to-[#9d4edd]/20 rounded-xl lg:rounded-2xl p-2 lg:p-3 border border-[#00f5ff]/30 flex-shrink-0">
            <MessageCircle className="h-4 w-4 lg:h-5 lg:w-5 text-[#00f5ff]" />
          </div>
        )}

        {/* Message Content */}
        <div
          className={`relative backdrop-blur-xl border shadow-lg ${
            message.role === "user"
              ? "bg-gradient-to-r from-[#9d4edd]/10 to-[#40e0d0]/10 border-[#9d4edd]/20 text-white"
              : "bg-gradient-to-r from-white/5 to-white/10 border-white/10 text-white"
          } p-4 lg:p-6 rounded-2xl lg:rounded-3xl transition-all duration-300 hover:shadow-xl`}
        >
          {/* Message Text */}
          <div className="prose prose-sm lg:prose-base max-w-none text-white">
            {message.role === "assistant" ? (
              <MarkdownMessage message={message.content} />
            ) : (
              <p className="mb-0 text-sm lg:text-base leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            )}
          </div>

          {/* Message Actions for Assistant Messages */}
          {message.role === "assistant" && (
            <MessageActions
              content={message.content}
              messageIndex={messageIndex}
              playingMessageIndex={playingMessageIndex}
              onCopy={onCopy}
              onShare={onShare}
              onPlayAudio={onPlayAudio}
              onDownload={onDownload}
            />
          )}
        </div>

        {/* User Avatar */}
        {message.role === "user" && (
          <div className="bg-gradient-to-br from-[#9d4edd]/20 to-[#40e0d0]/20 rounded-xl lg:rounded-2xl p-2 lg:p-3 border border-[#9d4edd]/30 flex-shrink-0">
            <div className="w-4 h-4 lg:w-5 lg:h-5 bg-gradient-to-br from-[#9d4edd] to-[#40e0d0] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleMessage;
