import {
  ChevronLeft,
  Download,
  Edit2,
  LogOut,
  MessageCircle,
  Plus,
  Settings,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Chat } from "../../../hooks/useChat";

interface SidebarProps {
  chats: Chat[];
  currentChat: Chat | null;
  editingTitle: string | null;
  newTitle: string;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setEditingTitle: (id: string | null) => void;
  setNewTitle: (title: string) => void;
  startNewChat: () => void;
  selectChat: (chat: Chat) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  shareChat: (chatId: string) => void;
  downloadChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  currentChat,
  editingTitle,
  newTitle,
  showSettings,
  setShowSettings,
  sidebarCollapsed,
  setSidebarCollapsed,
  setEditingTitle,
  setNewTitle,
  startNewChat,
  selectChat,
  updateChatTitle,
  shareChat,
  downloadChat,
  deleteChat,
}) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 sm:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      <div
        className={`
          ${
            sidebarCollapsed
              ? "w-16 sm:w-16 -translate-x-full sm:translate-x-0"
              : "w-full sm:w-72 md:w-80 lg:w-80 xl:w-96 translate-x-0"
          }
          bg-gradient-to-b from-[#030637] to-[#2a1a3e] backdrop-blur-xl border-r border-white/10 
          flex flex-col fixed left-0 top-0 h-full z-20 shadow-2xl shadow-black/20 transition-all duration-300
          ${
            showSettings && !sidebarCollapsed
              ? "transform -translate-x-full md:translate-x-0"
              : ""
          }
        `}
      >
        {/* Header */}
        <div className="p-3 sm:p-4 lg:p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
            {sidebarCollapsed ? (
              // Collapsed state - show only collapse/expand button
              <div className="flex items-center justify-center w-full">
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="text-[#D0D0D0] hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
                  title="Expand Sidebar"
                >
                  <MessageCircle className="h-5 w-5 text-[#00f5ff]" />
                </button>
              </div>
            ) : (
              // Expanded state - show full header
              <>
                <div className="flex items-center space-x-2 lg:space-x-3 min-w-0 flex-1">
                  <div className="bg-gradient-to-br from-[#00f5ff] to-[#9d4edd] rounded-lg sm:rounded-xl lg:rounded-2xl p-2 lg:p-3 shadow-lg shadow-[#00f5ff]/20 flex-shrink-0">
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-white font-bold text-sm sm:text-base lg:text-lg tracking-tight truncate">
                      AI Bondhu
                    </h1>
                    <p className="text-[#D0D0D0] text-xs hidden sm:block">
                      Chat Assistant
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                  {/* Close button for mobile */}
                  <button
                    onClick={() => setSidebarCollapsed(true)}
                    className="text-[#D0D0D0] hover:text-white p-1.5 sm:p-2 rounded-xl hover:bg-white/10 transition-all duration-300 sm:hidden"
                    title="Close Sidebar"
                  >
                    <X className="h-4 w-4 lg:h-5 lg:w-5" />
                  </button>
                  {/* Collapse button for desktop */}
                  <button
                    onClick={() => setSidebarCollapsed(true)}
                    className="text-[#D0D0D0] hover:text-white p-1.5 sm:p-2 rounded-xl hover:bg-white/10 transition-all duration-300 hidden sm:flex"
                    title="Collapse Sidebar"
                  >
                    <ChevronLeft className="h-4 w-4 lg:h-5 lg:w-5" />
                  </button>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-[#D0D0D0] hover:text-white p-1.5 sm:p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
                    title="Settings"
                  >
                    <Settings className="h-4 w-4 lg:h-5 lg:w-5" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* New Chat Button */}
          {!sidebarCollapsed && (
            <button
              onClick={() => {
                startNewChat();
                // Close sidebar on mobile after starting new chat
                if (window.innerWidth < 640) {
                  // sm breakpoint
                  setSidebarCollapsed(true);
                }
              }}
              className="w-full bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] hover:from-[#9d4edd] hover:to-[#00f5ff] text-white py-2 sm:py-2.5 lg:py-3 px-3 lg:px-4 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center space-x-2 transition-all duration-500 shadow-lg shadow-[#00f5ff]/20 hover:shadow-[#9d4edd]/30 transform hover:scale-105 font-semibold text-sm lg:text-base"
            >
              <Plus className="h-4 w-4 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              <span className="hidden xs:inline">New Chat</span>
              <span className="xs:hidden">New</span>
            </button>
          )}

          {/* User Info */}
          {!sidebarCollapsed && (
            <div className="mt-3 lg:mt-4 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/10">
              <div className="flex items-center justify-between gap-1 xs:gap-2">
                <div className="flex items-center space-x-2 lg:space-x-3 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[#00f5ff] to-[#9d4edd] rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white font-bold text-xs sm:text-xs lg:text-sm">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium text-xs sm:text-xs lg:text-sm truncate">
                      {user?.name || "User"}
                    </p>
                    <p
                      className="text-[#D0D0D0] text-xs truncate max-w-[120px] sm:max-w-[150px] lg:max-w-[180px] block sm:block"
                      title={user?.email}
                    >
                      {user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-[#D0D0D0] hover:text-red-400 p-1.5 lg:p-2 rounded-xl hover:bg-white/10 transition-all duration-300 flex-shrink-0"
                  title="Logout"
                >
                  <LogOut className="h-3 w-3 lg:h-4 lg:w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Chat List - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 lg:p-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
          {sidebarCollapsed ? (
            // Collapsed state - show compact chat indicators
            <div className="space-y-2">
              {/* Add New Chat button in collapsed state */}
              <button
                onClick={() => {
                  startNewChat();
                  // Close sidebar on mobile after starting new chat
                  if (window.innerWidth < 640) {
                    // sm breakpoint
                    setSidebarCollapsed(true);
                  }
                }}
                className="w-full p-1.5 sm:p-2 bg-gradient-to-r from-[#00f5ff]/20 to-[#9d4edd]/20 hover:from-[#9d4edd]/30 hover:to-[#00f5ff]/30 border border-[#00f5ff]/30 text-white rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-lg"
                title="New Chat"
              >
                <Plus className="h-4 w-4" />
              </button>

              {chats.length === 0 ? (
                <div className="text-center text-white/50 py-4 sm:py-6">
                  <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-[#00f5ff]" />
                </div>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat._id}
                    className={`group p-1.5 sm:p-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-xl border ${
                      currentChat?._id === chat._id
                        ? "bg-gradient-to-r from-[#00f5ff]/20 to-[#9d4edd]/20 border-[#00f5ff]/30 shadow-lg shadow-[#00f5ff]/10"
                        : "bg-gradient-to-r from-white/5 to-white/10 border-white/10 hover:from-white/10 hover:to-white/15 hover:border-[#40e0d0]/20"
                    }`}
                    onClick={() => {
                      selectChat(chat);
                      // Close sidebar on mobile after selecting a chat
                      if (window.innerWidth < 640) {
                        // sm breakpoint
                        setSidebarCollapsed(true);
                      }
                    }}
                    title={chat.title || "New Chat"}
                  >
                    <div className="flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-[#00f5ff]" />
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            // Expanded state - show full chat list
            <div className="space-y-1.5 sm:space-y-2 lg:space-y-3">
              {chats.length === 0 ? (
                <div className="text-center text-white/50 py-4 sm:py-6 lg:py-8">
                  <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/10">
                    <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-2 sm:mb-3 lg:mb-4 text-[#00f5ff]" />
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-1 sm:mb-2">
                      No Conversations Yet
                    </h3>
                    <p className="text-xs lg:text-sm text-[#D0D0D0] hidden sm:block">
                      Start a new chat to begin your AI conversation journey
                    </p>
                  </div>
                </div>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat._id}
                    className={`group p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl lg:rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-xl border ${
                      currentChat?._id === chat._id
                        ? "bg-gradient-to-r from-[#00f5ff]/20 to-[#9d4edd]/20 border-[#00f5ff]/30 shadow-lg shadow-[#00f5ff]/10"
                        : "bg-gradient-to-r from-white/5 to-white/10 border-white/10 hover:from-white/10 hover:to-white/15 hover:border-[#40e0d0]/20 hover:shadow-lg hover:shadow-[#40e0d0]/5"
                    }`}
                    onClick={() => {
                      selectChat(chat);
                      // Close sidebar on mobile after selecting a chat
                      if (window.innerWidth < 640) {
                        // sm breakpoint
                        setSidebarCollapsed(true);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      {editingTitle === chat._id ? (
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          onBlur={() => updateChatTitle(chat._id, newTitle)}
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            updateChatTitle(chat._id, newTitle)
                          }
                          className="bg-transparent text-white text-xs sm:text-xs lg:text-sm outline-none flex-1 placeholder-[#D0D0D0] min-w-0"
                          autoFocus
                        />
                      ) : (
                        <h3 className="text-white text-xs lg:text-sm font-semibold truncate flex-1">
                          {chat.title || "New Chat"}
                        </h3>
                      )}

                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTitle(chat._id);
                            setNewTitle(chat.title || "");
                          }}
                          className="p-1.5 lg:p-2 hover:bg-white/20 rounded-lg lg:rounded-xl transition-all duration-300 hover:shadow-lg"
                          title="Edit title"
                        >
                          <Edit2 className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-[#D0D0D0] hover:text-[#00f5ff]" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            shareChat(chat._id);
                          }}
                          className="p-1.5 lg:p-2 hover:bg-white/20 rounded-lg lg:rounded-xl transition-all duration-300 hover:shadow-lg"
                          title="Share chat"
                        >
                          <Share2 className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-[#D0D0D0] hover:text-[#9d4edd]" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadChat(chat._id);
                          }}
                          className="p-1.5 lg:p-2 hover:bg-white/20 rounded-lg lg:rounded-xl transition-all duration-300 hover:shadow-lg"
                          title="Download chat as PDF"
                        >
                          <Download className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-[#D0D0D0] hover:text-[#40e0d0]" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChat(chat._id);
                          }}
                          className="p-1.5 lg:p-2 hover:bg-red-500/20 rounded-lg lg:rounded-xl transition-all duration-300 hover:shadow-lg"
                          title="Delete chat"
                        >
                          <Trash2 className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-[#D0D0D0] hover:text-red-400" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[#D0D0D0] text-xs mt-1.5 lg:mt-2 truncate leading-relaxed">
                      {chat.messages[chat.messages.length - 1]?.content?.slice(
                        0,
                        60
                      ) + "..." || "No messages yet"}
                    </p>

                    <div className="flex items-center justify-between mt-1.5 lg:mt-2">
                      <span className="text-[#40e0d0] text-xs font-medium">
                        {chat.messages.length} messages
                      </span>
                      <span className="text-[#D0D0D0] text-xs">
                        {new Date(chat.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
