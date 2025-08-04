import { Clock, MessageCircle } from "lucide-react";
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
  const isUser = message.role === "user";

  // Format timestamp
  const timestamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex w-full mb-2 sm:mb-3 animate-slideUp ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex items-start max-w-[95%] xs:max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%] xl:max-w-[70%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        } gap-1 xs:gap-1.5 sm:gap-2`}
      >
        {/* Assistant Avatar */}
        {!isUser && (
          <div className="bg-gradient-to-br from-slate-100/10 to-slate-200/10 rounded-full p-1 xs:p-1.5 sm:p-2 border border-white/10 flex-shrink-0 shadow-lg mobile-avatar">
            <MessageCircle className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 text-cyan-400" />
          </div>
        )}

        {/* User Avatar */}
        {isUser && (
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full p-1 xs:p-1.5 sm:p-2 border border-blue-400/30 flex-shrink-0 shadow-lg mobile-avatar">
            <div className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-[6px] xs:text-[8px] sm:text-xs">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          </div>
        )}

        {/* Message Bubble */}
        <div className="flex flex-col min-w-0 flex-1">
          <div
            className={`relative backdrop-blur-sm border shadow-lg px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-xl group mobile-chat-message ${
              isUser
                ? "bg-gradient-to-r from-blue-600/90 to-cyan-600/90 border-blue-500/50 text-white rounded-br-md"
                : "bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-slate-600/30 text-gray-100 rounded-bl-md"
            }`}
          >
            {/* Message Content */}
            <div className="relative">
              {!isUser ? (
                <div className="prose prose-sm max-w-none prose-invert mobile-text-base">
                  <MarkdownMessage message={message.content} />
                </div>
              ) : (
                <p className="mb-0 text-sm sm:text-base leading-relaxed whitespace-pre-wrap mobile-text-base">
                  {message.content}
                </p>
              )}
            </div>

            {/* Timestamp and Actions Row */}
            <div
              className={`flex items-center justify-between gap-2 mt-2 ${
                isUser ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Timestamp */}
              <div className="flex items-center gap-1">
                <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-60" />
                <span className="text-[10px] sm:text-xs opacity-60 mobile-text-sm">
                  {timestamp}
                </span>
              </div>

              {/* Message Actions (for assistant messages) */}
              {!isUser && (
                <div className="opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                  <MessageActions
                    content={message.content}
                    messageIndex={messageIndex}
                    playingMessageIndex={playingMessageIndex}
                    onCopy={onCopy}
                    onShare={onShare}
                    onPlayAudio={onPlayAudio}
                    onDownload={onDownload}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleMessage;
