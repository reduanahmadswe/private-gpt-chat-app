import { Copy, Download, Share2, Volume2 } from "lucide-react";
import React from "react";

interface MessageActionsProps {
  content: string;
  messageIndex: number;
  playingMessageIndex: number | null;
  onCopy: (content: string) => void;
  onShare: (content: string) => void;
  onPlayAudio: (content: string, messageIndex: number) => void;
  onDownload: (content: string, messageIndex: number) => void;
}

const MessageActions: React.FC<MessageActionsProps> = ({
  content,
  messageIndex,
  playingMessageIndex,
  onCopy,
  onShare,
  onPlayAudio,
  onDownload,
}) => {
  const isPlaying = playingMessageIndex === messageIndex;

  return (
    <div className="flex items-center space-x-1">
      {/* Copy Button */}
      <button
        onClick={() => onCopy(content)}
        className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-600/60 hover:bg-slate-500/80 border border-slate-500/40 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-400 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-cyan-400/20 transform hover:scale-105"
        title="Copy message"
      >
        <Copy className="h-3 w-3" />
      </button>

      {/* Share Button */}
      <button
        onClick={() => onShare(content)}
        className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-600/60 hover:bg-slate-500/80 border border-slate-500/40 hover:border-blue-400/50 text-slate-300 hover:text-blue-400 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-blue-400/20 transform hover:scale-105"
        title="Share message"
      >
        <Share2 className="h-3 w-3" />
      </button>

      {/* Play Audio Button */}
      <button
        onClick={() => onPlayAudio(content, messageIndex)}
        className={`flex items-center justify-center w-6 h-6 rounded-md transition-all duration-200 shadow-sm transform hover:scale-105 ${
          isPlaying
            ? "bg-green-600/80 border-green-500/50 text-green-100 shadow-green-500/20"
            : "bg-slate-600/60 hover:bg-slate-500/80 border border-slate-500/40 hover:border-green-400/50 text-slate-300 hover:text-green-400 hover:shadow-md hover:shadow-green-400/20"
        }`}
        title={isPlaying ? "Playing..." : "Play audio"}
      >
        <Volume2 className="h-3 w-3" />
      </button>

      {/* Download Button */}
      <button
        onClick={() => onDownload(content, messageIndex)}
        className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-600/60 hover:bg-slate-500/80 border border-slate-500/40 hover:border-purple-400/50 text-slate-300 hover:text-purple-400 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-purple-400/20 transform hover:scale-105"
        title="Download message"
      >
        <Download className="h-3 w-3" />
      </button>
    </div>
  );
};

export default MessageActions;
