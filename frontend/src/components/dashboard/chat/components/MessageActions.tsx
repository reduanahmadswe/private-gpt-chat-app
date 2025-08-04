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
    <div className="flex items-center space-x-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
      {/* Copy Button */}
      <button
        onClick={() => onCopy(content)}
        className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 hover:border-[#00f5ff]/30 text-[#D0D0D0] hover:text-white transition-all duration-300 text-xs font-medium shadow-sm hover:shadow-lg hover:shadow-[#00f5ff]/10 transform hover:scale-105"
        title="Copy message"
      >
        <Copy className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Copy</span>
      </button>

      {/* Share Button */}
      <button
        onClick={() => onShare(content)}
        className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 hover:border-[#9d4edd]/30 text-[#D0D0D0] hover:text-white transition-all duration-300 text-xs font-medium shadow-sm hover:shadow-lg hover:shadow-[#9d4edd]/10 transform hover:scale-105"
        title="Share message"
      >
        <Share2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Share</span>
      </button>

      {/* Play Audio Button */}
      <button
        onClick={() => onPlayAudio(content, messageIndex)}
        className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all duration-300 text-xs font-medium shadow-sm transform hover:scale-105 ${
          isPlaying
            ? "bg-gradient-to-r from-[#ff6b6b]/20 to-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ff6b6b] hover:text-white animate-pulse"
            : "bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 hover:border-[#ff6b6b]/30 text-[#D0D0D0] hover:text-white hover:shadow-lg hover:shadow-[#ff6b6b]/10"
        }`}
        title={isPlaying ? "Playing audio..." : "Play message audio"}
      >
        <Volume2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">
          {isPlaying ? "Playing..." : "Play"}
        </span>
      </button>

      {/* Download Button */}
      <button
        onClick={() => onDownload(content, messageIndex)}
        className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 hover:border-[#22c55e]/30 text-[#D0D0D0] hover:text-white transition-all duration-300 text-xs font-medium shadow-sm hover:shadow-lg hover:shadow-[#22c55e]/10 transform hover:scale-105"
        title="Download message as PDF"
      >
        <Download className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Download</span>
      </button>
    </div>
  );
};

export default MessageActions;
