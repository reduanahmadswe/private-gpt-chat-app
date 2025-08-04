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
      className={`flex w-full mb-3 animate-slideUp ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex items-start max-w-[85%] md:max-w-[75%] lg:max-w-[60%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        } gap-2`}
      >
        {/* Assistant Avatar */}
        {!isUser && (
          <div className="bg-gradient-to-br from-slate-100/10 to-slate-200/10 rounded-full p-2 border border-white/10 flex-shrink-0 shadow-lg">
            <MessageCircle className="h-4 w-4 text-cyan-400" />
          </div>
        )}

        {/* User Avatar */}
        {isUser && (
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full p-2 border border-blue-400/30 flex-shrink-0 shadow-lg">
            <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          </div>
        )}

        {/* Message Bubble */}
        <div className="flex flex-col">
          <div
            className={`relative backdrop-blur-sm border shadow-lg px-4 py-3 rounded-2xl transition-all duration-300 hover:shadow-xl group ${
              isUser
                ? "bg-gradient-to-r from-blue-600/90 to-cyan-600/90 border-blue-500/50 text-white rounded-br-md"
                : "bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-slate-600/30 text-gray-100 rounded-bl-md"
            }`}
          >
            {/* Message Content */}
            <div className="relative">
              {!isUser ? (
                <div className="prose prose-sm max-w-none prose-invert">
                  <MarkdownMessage message={message.content} />
                </div>
              ) : (
                <p className="mb-0 text-sm leading-relaxed whitespace-pre-wrap">
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
                <Clock className="h-3 w-3 opacity-60" />
                <span className="text-xs opacity-60">{timestamp}</span>
              </div>

              {/* Message Actions (for assistant messages) */}
              {!isUser && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
