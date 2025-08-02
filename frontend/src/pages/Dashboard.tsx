import {
  Edit2,
  LogOut,
  MessageCircle,
  Plus,
  Send,
  Settings,
  Share2,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
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

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-[#030637] flex overflow-hidden font-sans">
      {/* Sidebar - Fixed Full Height */}
      <div className="w-80 bg-gradient-to-b from-[#030637] to-[#2a1a3e] backdrop-blur-xl border-r border-white/10 flex flex-col fixed left-0 top-0 h-full z-10 shadow-2xl shadow-black/20">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-[#00f5ff] to-[#9d4edd] rounded-2xl p-3 shadow-lg shadow-[#00f5ff]/20">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg tracking-tight">
                  AI Bondhu
                </h1>
                <p className="text-[#D0D0D0] text-xs">Chat Assistant</p>
              </div>
            </div>
            <Link
              to="/"
              className="text-[#D0D0D0] hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>

          {/* New Chat Button */}
          <button
            onClick={startNewChat}
            className="w-full bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] hover:from-[#9d4edd] hover:to-[#00f5ff] text-white py-3 px-4 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-500 shadow-lg shadow-[#00f5ff]/20 hover:shadow-[#9d4edd]/30 transform hover:scale-105 font-semibold"
          >
            <Plus className="h-5 w-5" />
            <span>New Chat</span>
          </button>

          {/* User Info */}
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00f5ff] to-[#9d4edd] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[#D0D0D0] text-xs">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-[#D0D0D0] hover:text-red-400 p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat List - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
          <div className="space-y-3">
            {chats.length === 0 ? (
              <div className="text-center text-white/50 py-8">
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-[#00f5ff]" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No Conversations Yet
                  </h3>
                  <p className="text-sm text-[#D0D0D0]">
                    Start a new chat to begin your AI conversation journey
                  </p>
                </div>
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat._id}
                  className={`group p-4 rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-xl border ${
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
                        className="bg-transparent text-white text-sm outline-none flex-1 placeholder-[#D0D0D0]"
                        autoFocus
                      />
                    ) : (
                      <h3 className="text-white text-sm font-semibold truncate flex-1">
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
                        className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:shadow-lg"
                        title="Edit title"
                      >
                        <Edit2 className="h-3 w-3 text-[#D0D0D0] hover:text-[#00f5ff]" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          shareChat(chat._id);
                        }}
                        className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:shadow-lg"
                        title="Share chat"
                      >
                        <Share2 className="h-3 w-3 text-[#D0D0D0] hover:text-[#9d4edd]" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(chat._id);
                        }}
                        className="p-2 hover:bg-red-500/20 rounded-xl transition-all duration-300 hover:shadow-lg"
                        title="Delete chat"
                      >
                        <Trash2 className="h-3 w-3 text-[#D0D0D0] hover:text-red-400" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[#D0D0D0] text-xs mt-2 truncate leading-relaxed">
                    {chat.messages[chat.messages.length - 1]?.content?.slice(
                      0,
                      80
                    ) + "..." || "No messages yet"}
                  </p>

                  <div className="flex items-center justify-between mt-2">
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

      {/* Main Chat Area - Offset by sidebar width */}
      <div className="flex-1 flex flex-col ml-80 h-screen bg-gradient-to-br from-[#030637] via-[#1a1a2e] to-[#16213e] backdrop-blur-xl">
        {/* Chat Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl flex-shrink-0 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-[#00f5ff]/20 to-[#9d4edd]/20 rounded-2xl p-3 border border-[#00f5ff]/30">
                <MessageCircle className="h-6 w-6 text-[#00f5ff]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {currentChat?.title || "New Conversation"}
                </h1>
                <p className="text-[#D0D0D0] text-sm">
                  {currentChat
                    ? `${messages.length} messages`
                    : "Start typing to begin"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-4 py-2 bg-gradient-to-r from-[#00f5ff]/10 to-[#9d4edd]/10 rounded-xl border border-[#00f5ff]/20">
                <span className="text-[#00f5ff] text-sm font-medium">
                  Claude 3.5 Sonnet
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages - Scrollable Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30 pb-32">
          <div className="max-w-5xl mx-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="text-center mt-20">
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/10 max-w-2xl mx-auto">
                  <div className="bg-gradient-to-br from-[#00f5ff]/20 to-[#9d4edd]/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 border border-[#00f5ff]/30">
                    <MessageCircle className="h-12 w-12 text-[#00f5ff] mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Ready to Chat
                  </h3>
                  <p className="text-[#D0D0D0] text-lg leading-relaxed">
                    I'm here to help you with any questions or tasks. Start a
                    conversation and let's explore what we can accomplish
                    together.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div className="bg-gradient-to-r from-[#00f5ff]/10 to-[#40e0d0]/10 p-4 rounded-2xl border border-[#00f5ff]/20">
                      <h4 className="text-[#00f5ff] font-semibold mb-2">
                        Ask Questions
                      </h4>
                      <p className="text-[#D0D0D0] text-sm">
                        Get detailed answers on any topic
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-[#9d4edd]/10 to-[#40e0d0]/10 p-4 rounded-2xl border border-[#9d4edd]/20">
                      <h4 className="text-[#9d4edd] font-semibold mb-2">
                        Get Help
                      </h4>
                      <p className="text-[#D0D0D0] text-sm">
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
                  <div className="flex items-start space-x-4 max-w-4xl">
                    {message.role === "assistant" && (
                      <div className="bg-gradient-to-br from-[#00f5ff]/20 to-[#9d4edd]/20 rounded-2xl p-3 border border-[#00f5ff]/30 flex-shrink-0">
                        <MessageCircle className="h-5 w-5 text-[#00f5ff]" />
                      </div>
                    )}
                    <div
                      className={`p-6 rounded-3xl backdrop-blur-xl shadow-lg ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-[#9d4edd]/20 to-[#40e0d0]/20 border border-[#9d4edd]/30 text-white ml-auto"
                          : "bg-gradient-to-r from-white/5 to-white/10 border border-white/10 text-white"
                      }`}
                    >
                      <div className="prose prose-invert max-w-none">
                        <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                          {message.content}
                        </p>
                      </div>
                    </div>
                    {message.role === "user" && (
                      <div className="bg-gradient-to-br from-[#9d4edd]/20 to-[#40e0d0]/20 rounded-2xl p-3 border border-[#9d4edd]/30 flex-shrink-0">
                        <div className="w-5 h-5 bg-gradient-to-br from-[#9d4edd] to-[#40e0d0] rounded-full flex items-center justify-center">
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
                <div className="flex items-start space-x-4 max-w-4xl">
                  <div className="bg-gradient-to-br from-[#00f5ff]/20 to-[#9d4edd]/20 rounded-2xl p-3 border border-[#00f5ff]/30 flex-shrink-0">
                    <MessageCircle className="h-5 w-5 text-[#00f5ff]" />
                  </div>
                  <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/10 text-white p-6 rounded-3xl shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#00f5ff] rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-[#9d4edd] rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-[#40e0d0] rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-[#D0D0D0] font-medium">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area - Fixed at Bottom */}
        <div className="fixed bottom-0 left-80 right-0 p-6 bg-gradient-to-t from-[#030637] via-[#1a1a2e]/95 to-transparent backdrop-blur-xl border-t border-white/10 z-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl shadow-black/20 p-2">
              <div className="flex items-end space-x-4">
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
                    className="w-full px-6 py-4 bg-transparent text-white placeholder-[#D0D0D0] rounded-2xl border-none focus:outline-none resize-none scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent text-base leading-relaxed"
                    disabled={loading}
                    rows={1}
                    style={{
                      minHeight: "24px",
                      maxHeight: "120px",
                      overflow: "auto",
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "24px";
                      target.style.height = target.scrollHeight + "px";
                    }}
                  />
                  {inputMessage && (
                    <button
                      onClick={() => setInputMessage("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#D0D0D0] hover:text-white transition-colors p-1 rounded-xl hover:bg-white/10"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
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
                  className="px-6 py-4 bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] hover:from-[#9d4edd] hover:to-[#00f5ff] disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-2xl transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-[#00f5ff]/50 flex items-center justify-center min-w-[60px] shadow-lg shadow-[#00f5ff]/20 hover:shadow-[#9d4edd]/30 transform hover:scale-105 disabled:transform-none disabled:shadow-none"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs text-[#D0D0D0]/70 mt-4 text-center leading-relaxed">
              AI responses are generated and may contain inaccuracies. Please
              verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
