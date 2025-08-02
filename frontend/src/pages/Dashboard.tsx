import {
  Bold,
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
    <div className="min-h-screen flex overflow-hidden">
      {/* Sidebar - Fixed Full Height */}
      <div className="w-80 bg-white/5 backdrop-blur-sm border-r border-white/10 flex flex-col fixed left-0 top-0 h-full z-10">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              <span className="text-blue-600 font-bold">Ai </span>Bondhu
            </h2>
            <button
              onClick={startNewChat}
              className="btn-primary p-2"
              title="New Chat"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2 text-sm text-white/70">
            <span>Welcome, {user?.name}</span>
          </div>
        </div>

        {/* Chat List - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
          <div className="space-y-2">
            {chats.length === 0 ? (
              <div className="text-center text-white/50 py-8">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No chats yet</p>
                <p className="text-xs">
                  Start a conversation to see your chats here
                </p>
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat._id}
                  className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    currentChat?._id === chat._id
                      ? "bg-primary-600/20 border border-primary-500/30"
                      : "hover:bg-white/5"
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
                        className="bg-transparent text-white text-sm outline-none flex-1"
                        autoFocus
                      />
                    ) : (
                      <h3 className="text-white text-sm font-medium truncate flex-1">
                        {chat.title || "New Chat"}
                      </h3>
                    )}

                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTitle(chat._id);
                          setNewTitle(chat.title || "");
                        }}
                        className="p-1 hover:bg-white/10 rounded"
                        title="Edit title"
                      >
                        <Edit2 className="h-3 w-3 text-white/60" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          shareChat(chat._id);
                        }}
                        className="p-1 hover:bg-white/10 rounded"
                        title="Share chat"
                      >
                        <Share2 className="h-3 w-3 text-white/60" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(chat._id);
                        }}
                        className="p-1 hover:bg-white/10 rounded"
                        title="Delete chat"
                      >
                        <Trash2 className="h-3 w-3 text-white/60" />
                      </button>
                    </div>
                  </div>

                  <p className="text-white/50 text-xs mt-1 truncate">
                    {chat.messages[chat.messages.length - 1]?.content ||
                      "No messages yet"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2 flex-shrink-0">
          <Link
            to="/settings"
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>

          <button
            onClick={logout}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area - Offset by sidebar width */}
      <div className="flex-1 flex flex-col ml-80 h-screen">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-sm flex-shrink-0">
          <h1 className="text-xl font-semibold text-white">
            {currentChat?.title || "New Chat"}
          </h1>
        </div>

        {/* Messages - Scrollable Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30 pb-28">
          <div className="max-w-4xl mx-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-white/50 mt-20">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">
                  Start a conversation
                </h3>
                <p>
                  Ask me anything and I'll help you with detailed responses.
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-3xl p-4 rounded-lg ${
                      message.role === "user"
                        ? "bg-white/5 text-white"
                        : "bg-white/10 backdrop-blur-sm text-white"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 backdrop-blur-sm text-white p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse">Thinking...</div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
  
        <div className="bottom-0 left-80 right-0 p-4 z-20">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center space-x-4">
              {/* Input field */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && !loading && sendMessage()
                  }
                  placeholder="Type your message..."
                  className="w-full px-6 py-4 bg-white/5 text-white placeholder-gray-400 rounded-2xl border border-[#910A67] focus:outline-none focus:ring-2 focus:ring-[#910A67] focus:border-transparent text-base"
                  disabled={loading}
                />
                {inputMessage && (
                  <button
                    onClick={() => setInputMessage("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
                className="px-6 py-4 bg-[#ff22b97c] hover:bg-[#720455] disabled:bg-[#3C0753] disabled:cursor-not-allowed text-white rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#910A67] flex items-center justify-center min-w-[120px]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span className="ml-2 hidden sm:inline">Send</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-3 text-center">
              AI may produce inaccurate information. Consider verifying
              important details.
            </p>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Dashboard;
