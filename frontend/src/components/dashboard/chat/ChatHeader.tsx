import { Info, Menu, MessageCircle } from "lucide-react";
import React, { useState } from "react";
import { Chat } from "../../../hooks/useChat";
import DeveloperInfo from "../../DeveloperInfo";
import RealTimeClock from "../../RealTimeClock";

interface ChatHeaderProps {
  currentChat: Chat | null;
  messagesCount: number;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  isHeaderVisible?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  currentChat,
  messagesCount,
  sidebarCollapsed,
  setSidebarCollapsed,
  isHeaderVisible = true,
}) => {
  const [showDeveloperInfo, setShowDeveloperInfo] = useState(false);

  return (
    <>
      <div
        className={`absolute top-0 left-0 right-0 z-10 p-3 xs:p-4 lg:p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl shadow-lg transition-all duration-200 ease-out ${
          isHeaderVisible
            ? "transform translate-y-0 opacity-100"
            : "transform -translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 xs:space-x-3 lg:space-x-4 min-w-0 flex-1">
            {/* Mobile hamburger menu - always show on mobile when sidebar is collapsed */}
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="text-[#D0D0D0] hover:text-white p-1.5 xs:p-2 rounded-xl hover:bg-white/10 transition-all duration-300 sm:hidden flex-shrink-0"
                title="Open Sidebar"
              >
                <Menu className="h-4 w-4 xs:h-5 xs:w-5" />
              </button>
            )}
            <div className="bg-gradient-to-br from-[#00f5ff]/20 to-[#9d4edd]/20 rounded-lg xs:rounded-xl lg:rounded-2xl p-1.5 xs:p-2 lg:p-3 border border-[#00f5ff]/30 flex-shrink-0">
              <MessageCircle className="h-4 w-4 xs:h-5 xs:w-5 lg:h-6 lg:w-6 text-[#00f5ff]" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm xs:text-base sm:text-lg lg:text-2xl font-bold text-white tracking-tight truncate">
                {currentChat?.title || "New Conversation"}
              </h1>
              <p className="text-[#D0D0D0] text-xs sm:text-xs lg:text-sm truncate">
                {currentChat
                  ? `${messagesCount} messages`
                  : "Start typing to begin"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Developer Info Button */}
            <button
              onClick={() => setShowDeveloperInfo(true)}
              className="flex px-2 xs:px-3 lg:px-4 py-1 xs:py-1.5 lg:py-2 bg-gradient-to-r from-[#ff6b6b]/10 to-[#9d4edd]/10 rounded-md xs:rounded-lg lg:rounded-xl border border-[#ff6b6b]/20 hover:border-[#ff6b6b]/40 transition-all duration-300 group"
              title="Developer Info"
            >
              <Info className="h-3 w-3 sm:h-4 sm:w-4 text-[#ff6b6b] group-hover:scale-110 transition-transform" />
            </button>

            {/* Real-time Clock */}
            <div className="flex px-2 xs:px-3 lg:px-4 py-1 xs:py-1.5 lg:py-2 bg-gradient-to-r from-[#9d4edd]/10 to-[#ff6b6b]/10 rounded-md xs:rounded-lg lg:rounded-xl border border-[#9d4edd]/20">
              <RealTimeClock className="text-[#9d4edd] text-xs sm:text-xs lg:text-sm font-medium whitespace-nowrap" />
            </div>

            <div className="flex px-2 xs:px-3 lg:px-4 py-1 xs:py-1.5 lg:py-2 bg-gradient-to-r from-[#00f5ff]/10 to-[#9d4edd]/10 rounded-md xs:rounded-lg lg:rounded-xl border border-[#00f5ff]/20">
              <span className="text-[#00f5ff] text-xs sm:text-xs lg:text-sm font-medium whitespace-nowrap">
                AI Bondhu
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Info Modal */}
      {showDeveloperInfo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowDeveloperInfo(false)}
              className="absolute top-4 right-4 z-10 bg-red-500/20 hover:bg-red-500/30 rounded-full p-2 transition-colors"
            >
              <svg
                className="w-5 h-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <DeveloperInfo />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatHeader;
