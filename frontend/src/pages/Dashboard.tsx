import {
  Copy,
  Edit2,
  Lock,
  LogOut,
  MessageCircle,
  Plus,
  Send,
  Settings,
  Share2,
  Trash2,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";

interface Chat {
  _id: string;
  title: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState("account");
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [settingsLoading, setSettingsLoading] = useState(false);

  useEffect(() => {
    // Fetch chats when component mounts
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await api.get("/api/chat");
      setChats(response.data.chats);
    } catch (error) {
      toast.error("Failed to fetch chats");
    }
  };

  const startNewChat = () => {
    setCurrentChat(null);
    setMessages([]);
  };

  const selectChat = (chat: Chat) => {
    setCurrentChat(chat);
    setMessages(chat.messages);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = { role: "user", content: inputMessage };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await api.post("/api/chat", {
        message: inputMessage,
        chatId: currentChat?._id,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.response,
      };

      setMessages([...newMessages, assistantMessage]);

      if (!currentChat) {
        // New chat created
        setCurrentChat(response.data.chat);
        fetchChats();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const deleteChat = async (chatId: string) => {
    if (!confirm("Are you sure you want to delete this chat?")) return;

    try {
      await api.delete(`/api/chat/${chatId}`);
      setChats(chats.filter((chat) => chat._id !== chatId));
      if (currentChat?._id === chatId) {
        setCurrentChat(null);
        setMessages([]);
      }
      toast.success("Chat deleted successfully");
    } catch (error) {
      toast.error("Failed to delete chat");
    }
  };

  const updateChatTitle = async (chatId: string, title: string) => {
    try {
      await api.patch(`/api/chat/${chatId}`, { title });
      setChats(
        chats.map((chat) => (chat._id === chatId ? { ...chat, title } : chat))
      );
      if (currentChat?._id === chatId) {
        setCurrentChat({ ...currentChat, title });
      }
      setEditingTitle(null);
      toast.success("Chat title updated");
    } catch (error) {
      toast.error("Failed to update chat title");
    }
  };

  const shareChat = async (chatId: string) => {
    try {
      await api.post(`/api/chat/${chatId}/share`);
      const shareUrl = `${window.location.origin}/chat/${chatId}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to share chat");
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);

    try {
      await api.patch("/api/user/update", profileData);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSettingsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    setSettingsLoading(true);

    try {
      await api.patch("/api/user/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setSettingsLoading(false);
    }
  };

  // Copy message content to clipboard
  const copyMessageContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Message copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy message");
    }
  };

  // Share message content
  const shareMessageContent = async (content: string) => {
    try {
      if (navigator.share) {
        // Use Web Share API if available (mobile devices)
        await navigator.share({
          title: "AI Assistant Response",
          text: content,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(content);
        toast.success("Message copied to clipboard for sharing!");
      }
    } catch (error) {
      // If user cancels share dialog, don't show error
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Failed to share message");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#030637] flex overflow-hidden font-sans relative">
      {/* Backdrop overlay for mobile settings */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-25 lg:hidden"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <div
        className={`w-80 lg:w-80 md:w-72 sm:w-64 bg-gradient-to-b from-[#030637] to-[#2a1a3e] backdrop-blur-xl border-r border-white/10 flex flex-col fixed left-0 top-0 h-full z-20 shadow-2xl shadow-black/20 transition-transform duration-300 ${
          showSettings
            ? "transform -translate-x-full lg:translate-x-0"
            : "transform translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="bg-gradient-to-br from-[#00f5ff] to-[#9d4edd] rounded-xl lg:rounded-2xl p-2 lg:p-3 shadow-lg shadow-[#00f5ff]/20">
                <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-base lg:text-lg tracking-tight">
                  AI Bondhu
                </h1>
                <p className="text-[#D0D0D0] text-xs">Chat Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-[#D0D0D0] hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
              title="Settings"
            >
              <Settings className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={startNewChat}
            className="w-full bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] hover:from-[#9d4edd] hover:to-[#00f5ff] text-white py-2.5 lg:py-3 px-3 lg:px-4 rounded-xl lg:rounded-2xl flex items-center justify-center space-x-2 transition-all duration-500 shadow-lg shadow-[#00f5ff]/20 hover:shadow-[#9d4edd]/30 transform hover:scale-105 font-semibold text-sm lg:text-base"
          >
            <Plus className="h-4 w-4 lg:h-5 lg:w-5" />
            <span>New Chat</span>
          </button>

          {/* User Info */}
          <div className="mt-3 lg:mt-4 p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[#00f5ff] to-[#9d4edd] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xs lg:text-sm">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium text-xs lg:text-sm">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[#D0D0D0] text-xs truncate max-w-24 lg:max-w-none">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-[#D0D0D0] hover:text-red-400 p-1.5 lg:p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
                title="Logout"
              >
                <LogOut className="h-3 w-3 lg:h-4 lg:w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat List - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
          <div className="space-y-2 lg:space-y-3">
            {chats.length === 0 ? (
              <div className="text-center text-white/50 py-6 lg:py-8">
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-white/10">
                  <MessageCircle className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-3 lg:mb-4 text-[#00f5ff]" />
                  <h3 className="text-base lg:text-lg font-semibold text-white mb-2">
                    No Conversations Yet
                  </h3>
                  <p className="text-xs lg:text-sm text-[#D0D0D0]">
                    Start a new chat to begin your AI conversation journey
                  </p>
                </div>
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat._id}
                  className={`group p-3 lg:p-4 rounded-xl lg:rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-xl border ${
                    currentChat?._id === chat._id
                      ? "bg-gradient-to-r from-[#00f5ff]/20 to-[#9d4edd]/20 border-[#00f5ff]/30 shadow-lg shadow-[#00f5ff]/10"
                      : "bg-gradient-to-r from-white/5 to-white/10 border-white/10 hover:from-white/10 hover:to-white/15 hover:border-[#40e0d0]/20 hover:shadow-lg hover:shadow-[#40e0d0]/5"
                  }`}
                  onClick={() => selectChat(chat)}
                >
                  <div className="flex items-center justify-between">
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
                        className="bg-transparent text-white text-xs lg:text-sm outline-none flex-1 placeholder-[#D0D0D0]"
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
        </div>
      </div>

      {/* Settings Panel - Slides from right */}
      <div
        className={`fixed right-0 top-0 h-full w-80 lg:w-96 bg-gradient-to-b from-[#030637] to-[#2a1a3e] backdrop-blur-xl border-l border-white/10 z-30 shadow-2xl shadow-black/20 transform transition-transform duration-300 flex flex-col ${
          showSettings ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Fixed Header */}
        <div className="p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Settings</h2>
            <button
              onClick={() => setShowSettings(false)}
              className="text-[#D0D0D0] hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              <svg
                className="h-5 w-5"
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
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
          <div className="p-6 space-y-6 pb-8">
            {/* Settings Tabs */}
            <div className="flex space-x-2 border-b border-white/20 pb-4">
              <button
                onClick={() => setSettingsTab("account")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  settingsTab === "account"
                    ? "bg-gradient-to-r from-[#00f5ff]/20 to-[#9d4edd]/20 border border-[#00f5ff]/30 text-white"
                    : "text-[#D0D0D0] hover:text-white hover:bg-white/10"
                }`}
              >
                <User className="h-4 w-4" />
                <span className="text-sm">Account</span>
              </button>
              <button
                onClick={() => setSettingsTab("password")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  settingsTab === "password"
                    ? "bg-gradient-to-r from-[#00f5ff]/20 to-[#9d4edd]/20 border border-[#00f5ff]/30 text-white"
                    : "text-[#D0D0D0] hover:text-white hover:bg-white/10"
                }`}
              >
                <Lock className="h-4 w-4" />
                <span className="text-sm">Password</span>
              </button>
            </div>

            {/* Account Tab */}
            {settingsTab === "account" && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Profile Information</span>
                  </h3>

                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label className="block text-[#D0D0D0] text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white/5 text-white placeholder-[#D0D0D0] rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00f5ff]/50 focus:border-[#00f5ff]/30 transition-all duration-300 text-sm"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[#D0D0D0] text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white/5 text-white placeholder-[#D0D0D0] rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00f5ff]/50 focus:border-[#00f5ff]/30 transition-all duration-300 text-sm"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={settingsLoading}
                      className={`w-full px-4 py-2 bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] hover:from-[#9d4edd] hover:to-[#00f5ff] text-white rounded-xl font-medium transition-all duration-500 shadow-lg shadow-[#00f5ff]/20 hover:shadow-[#9d4edd]/30 transform hover:scale-105 text-sm ${
                        settingsLoading
                          ? "opacity-50 cursor-not-allowed transform-none"
                          : ""
                      }`}
                    >
                      {settingsLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Updating...</span>
                        </div>
                      ) : (
                        "Update Profile"
                      )}
                    </button>
                  </form>
                </div>

                {/* Current Account Info */}
                <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-3">
                    Account Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2">
                      <span className="text-[#D0D0D0] text-sm">Plan</span>
                      <span className="text-[#40e0d0] font-medium text-sm">
                        Free
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2">
                      <span className="text-[#D0D0D0] text-sm">
                        Member Since
                      </span>
                      <span className="text-white text-sm">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Password Tab */}
            {settingsTab === "password" && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Change Password</span>
                  </h3>

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-[#D0D0D0] text-sm font-medium mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white/5 text-white placeholder-[#D0D0D0] rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#9d4edd]/50 focus:border-[#9d4edd]/30 transition-all duration-300 text-sm"
                        placeholder="Enter current password"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[#D0D0D0] text-sm font-medium mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white/5 text-white placeholder-[#D0D0D0] rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#9d4edd]/50 focus:border-[#9d4edd]/30 transition-all duration-300 text-sm"
                        placeholder="Enter new password"
                        required
                        minLength={6}
                      />
                    </div>

                    <div>
                      <label className="block text-[#D0D0D0] text-sm font-medium mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white/5 text-white placeholder-[#D0D0D0] rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#9d4edd]/50 focus:border-[#9d4edd]/30 transition-all duration-300 text-sm"
                        placeholder="Confirm new password"
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="bg-gradient-to-r from-[#00f5ff]/10 to-[#9d4edd]/10 rounded-xl p-3 border border-[#00f5ff]/20">
                      <h4 className="text-white font-medium mb-2 text-sm">
                        Password Requirements
                      </h4>
                      <ul className="text-[#D0D0D0] text-xs space-y-1">
                        <li>• Minimum 6 characters long</li>
                        <li>• Include both letters and numbers</li>
                        <li>• Use a unique password</li>
                      </ul>
                    </div>

                    <button
                      type="submit"
                      disabled={settingsLoading}
                      className={`w-full px-4 py-2 bg-gradient-to-r from-[#9d4edd] to-[#40e0d0] hover:from-[#40e0d0] hover:to-[#9d4edd] text-white rounded-xl font-medium transition-all duration-500 shadow-lg shadow-[#9d4edd]/20 hover:shadow-[#40e0d0]/30 transform hover:scale-105 text-sm ${
                        settingsLoading
                          ? "opacity-50 cursor-not-allowed transform-none"
                          : ""
                      }`}
                    >
                      {settingsLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Changing...</span>
                        </div>
                      ) : (
                        "Change Password"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* AI Model Info */}
            <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3">AI Model</h3>
              <div className="bg-gradient-to-r from-[#00f5ff]/10 to-[#9d4edd]/10 rounded-xl p-3 border border-[#00f5ff]/20">
                <p className="text-[#00f5ff] font-medium text-sm">
                  Claude 3.5 Sonnet
                </p>
                <p className="text-[#D0D0D0] text-xs">
                  Advanced reasoning and analysis
                </p>
              </div>
            </div>

            {/* Export Data */}
            <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3">Data Export</h3>
              <button className="w-full p-3 bg-gradient-to-r from-[#9d4edd]/20 to-[#40e0d0]/20 border border-[#9d4edd]/30 rounded-xl text-white hover:from-[#9d4edd]/30 hover:to-[#40e0d0]/30 transition-all duration-300 text-sm">
                Export Chat History
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="w-full p-3 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl text-red-400 hover:from-red-500/30 hover:to-red-600/30 hover:text-red-300 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area - Responsive layout */}
      <div
        className={`flex-1 flex flex-col h-screen bg-gradient-to-br from-[#030637] via-[#1a1a2e] to-[#16213e] backdrop-blur-xl transition-all duration-300 ${
          showSettings ? "lg:mr-96" : "mr-0"
        } ml-64 lg:ml-80`}
      >
        {/* Chat Header */}
        <div className="p-4 lg:p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl flex-shrink-0 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="bg-gradient-to-br from-[#00f5ff]/20 to-[#9d4edd]/20 rounded-xl lg:rounded-2xl p-2 lg:p-3 border border-[#00f5ff]/30">
                <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6 text-[#00f5ff]" />
              </div>
              <div>
                <h1 className="text-lg lg:text-2xl font-bold text-white tracking-tight">
                  {currentChat?.title || "New Conversation"}
                </h1>
                <p className="text-[#D0D0D0] text-xs lg:text-sm">
                  {currentChat
                    ? `${messages.length} messages`
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

        {/* Messages - Scrollable Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
          <div className="max-w-4xl lg:max-w-5xl mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
            {messages.length === 0 ? (
              <div className="text-center mt-12 lg:mt-20">
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-8 lg:p-12 border border-white/10 max-w-xl lg:max-w-2xl mx-auto">
                  <div className="bg-gradient-to-br from-[#00f5ff]/20 to-[#9d4edd]/20 rounded-full p-4 lg:p-6 w-16 h-16 lg:w-24 lg:h-24 mx-auto mb-4 lg:mb-6 border border-[#00f5ff]/30">
                    <MessageCircle className="h-8 w-8 lg:h-12 lg:w-12 text-[#00f5ff] mx-auto" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 lg:mb-4">
                    Ready to Chat
                  </h3>
                  <p className="text-[#D0D0D0] text-base lg:text-lg leading-relaxed">
                    I'm here to help you with any questions or tasks. Start a
                    conversation and let's explore what we can accomplish
                    together.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mt-6 lg:mt-8">
                    <div className="bg-gradient-to-r from-[#00f5ff]/10 to-[#40e0d0]/10 p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-[#00f5ff]/20">
                      <h4 className="text-[#00f5ff] font-semibold mb-1 lg:mb-2 text-sm lg:text-base">
                        Ask Questions
                      </h4>
                      <p className="text-[#D0D0D0] text-xs lg:text-sm">
                        Get detailed answers on any topic
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-[#9d4edd]/10 to-[#40e0d0]/10 p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-[#9d4edd]/20">
                      <h4 className="text-[#9d4edd] font-semibold mb-1 lg:mb-2 text-sm lg:text-base">
                        Get Help
                      </h4>
                      <p className="text-[#D0D0D0] text-xs lg:text-sm">
                        Solve problems and learn new things
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex items-start space-x-2 lg:space-x-4 max-w-3xl lg:max-w-4xl">
                    {message.role === "assistant" && (
                      <div className="bg-gradient-to-br from-[#00f5ff]/20 to-[#9d4edd]/20 rounded-xl lg:rounded-2xl p-2 lg:p-3 border border-[#00f5ff]/30 flex-shrink-0">
                        <MessageCircle className="h-4 w-4 lg:h-5 lg:w-5 text-[#00f5ff]" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div
                        className={`p-4 lg:p-6 rounded-2xl lg:rounded-3xl backdrop-blur-xl shadow-lg ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-[#9d4edd]/20 to-[#40e0d0]/20 border border-[#9d4edd]/30 text-white ml-auto"
                            : "bg-gradient-to-r from-white/5 to-white/10 border border-white/10 text-white"
                        }`}
                      >
                        <div className="prose prose-invert max-w-none">
                          <p className="whitespace-pre-wrap leading-relaxed text-sm lg:text-base">
                            {message.content}
                          </p>
                        </div>
                        
                        {/* Copy and Share buttons for AI responses */}
                        {message.role === "assistant" && (
                          <div className="flex items-center justify-end space-x-2 mt-4 pt-3 border-t border-white/10">
                            <button
                              onClick={() => copyMessageContent(message.content)}
                              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 hover:border-[#00f5ff]/30 text-[#D0D0D0] hover:text-white transition-all duration-300 text-xs font-medium shadow-sm hover:shadow-lg hover:shadow-[#00f5ff]/10 transform hover:scale-105"
                              title="Copy message to clipboard"
                            >
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy</span>
                            </button>
                            <button
                              onClick={() => shareMessageContent(message.content)}
                              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 hover:border-[#9d4edd]/30 text-[#D0D0D0] hover:text-white transition-all duration-300 text-xs font-medium shadow-sm hover:shadow-lg hover:shadow-[#9d4edd]/10 transform hover:scale-105"
                              title="Share this message"
                            >
                              <Share2 className="h-3.5 w-3.5" />
                              <span>Share</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
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
              ))
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 lg:space-x-4 max-w-3xl lg:max-w-4xl">
                  <div className="bg-gradient-to-br from-[#00f5ff]/20 to-[#9d4edd]/20 rounded-xl lg:rounded-2xl p-2 lg:p-3 border border-[#00f5ff]/30 flex-shrink-0">
                    <MessageCircle className="h-4 w-4 lg:h-5 lg:w-5 text-[#00f5ff]" />
                  </div>
                  <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/10 text-white p-4 lg:p-6 rounded-2xl lg:rounded-3xl shadow-lg">
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-[#00f5ff] rounded-full animate-bounce"></div>
                        <div
                          className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-[#9d4edd] rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-[#40e0d0] rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-[#D0D0D0] font-medium text-sm lg:text-base">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area - Integrated */}

        <div className=" mx-auto">
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/20 shadow-2xl shadow-black/20 p-2">
            <div className="flex items-end space-x-2 lg:space-x-4">
              {/* Input field */}
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !loading) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type your message... (Shift + Enter for new line)"
                  className="w-full px-4 lg:px-6 py-3 lg:py-4 bg-transparent text-white placeholder-[#D0D0D0] rounded-xl lg:rounded-2xl border-none focus:outline-none resize-none scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent text-sm lg:text-base leading-relaxed"
                  disabled={loading}
                  rows={1}
                  style={{
                    minHeight: "20px",
                    maxHeight: "100px",
                    overflow: "auto",
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "20px";
                    target.style.height = target.scrollHeight + "px";
                  }}
                />
                {inputMessage && (
                  <button
                    onClick={() => setInputMessage("")}
                    className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-[#D0D0D0] hover:text-white transition-colors p-1 rounded-xl hover:bg-white/10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 lg:h-4 lg:w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Send Button */}
              <button
                onClick={sendMessage}
                disabled={loading || !inputMessage.trim()}
                className="px-4 lg:px-6 py-3 lg:py-4 bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] hover:from-[#9d4edd] hover:to-[#00f5ff] disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl lg:rounded-2xl transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-[#00f5ff]/50 flex items-center justify-center min-w-[50px] lg:min-w-[60px] shadow-lg shadow-[#00f5ff]/20 hover:shadow-[#9d4edd]/30 transform hover:scale-105 disabled:transform-none disabled:shadow-none"
              >
                {loading ? (
                  <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Send className="h-4 w-4 lg:h-5 lg:w-5" />
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-[#D0D0D0]/70 mt-3 lg:mt-4 text-center leading-relaxed">
            AI responses are generated and may contain inaccuracies. Please
            verify important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
