import { Menu, MessageCircle } from "lucide-react";
import React from "react";
import { Chat } from "../../../hooks/useChat";

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
  return (
    <div
      className={`absolute top-0 left-0 right-0 z-10 p-4 lg:p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl shadow-lg transition-all duration-300 ${
        isHeaderVisible
          ? "transform translate-y-0 opacity-100"
          : "transform -translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 lg:space-x-4">
          {/* Mobile hamburger menu - always show on mobile when sidebar is collapsed */}
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="text-[#D0D0D0] hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-300 sm:hidden"
              title="Open Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <div className="bg-gradient-to-br from-[#00f5ff]/20 to-[#9d4edd]/20 rounded-xl lg:rounded-2xl p-2 lg:p-3 border border-[#00f5ff]/30">
            <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6 text-[#00f5ff]" />
          </div>
          <div>
            <h1 className="text-lg lg:text-2xl font-bold text-white tracking-tight">
              {currentChat?.title || "New Conversation"}
            </h1>
            <p className="text-[#D0D0D0] text-xs lg:text-sm">
              {currentChat
                ? `${messagesCount} messages`
                : "Start typing to begin"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gradient-to-r from-[#00f5ff]/10 to-[#9d4edd]/10 rounded-lg lg:rounded-xl border border-[#00f5ff]/20">
            <span className="text-[#00f5ff] text-xs lg:text-sm font-medium">
              Claude 3.5 Sonnet
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
