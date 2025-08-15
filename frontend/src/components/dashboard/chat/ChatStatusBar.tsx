import React from "react";
import RealTimeClock from "../../RealTimeClock";

interface ChatStatusBarProps {
  className?: string;
}

const ChatStatusBar: React.FC<ChatStatusBarProps> = ({ className = "" }) => {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 px-4 py-2 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-t border-white/10 shadow-lg ${className}`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Online Status */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-xs font-medium">Online</span>
        </div>

        {/* Center: Real-time Clock */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center px-3 py-1 bg-gradient-to-r from-[#00f5ff]/10 to-[#9d4edd]/10 rounded-lg border border-[#00f5ff]/20">
            <svg
              className="w-3 h-3 text-[#00f5ff] mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            <RealTimeClock className="text-[#00f5ff] text-sm font-medium" />
          </div>
        </div>

        {/* Right: App Status */}
        <div className="flex items-center space-x-2">
          <span className="text-[#9d4edd] text-xs font-medium">AI Bondhu</span>
          <div className="w-2 h-2 bg-[#9d4edd] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatStatusBar;
