import { Copy, MessageCircle, Share2, Volume2 } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";
import { Message } from "../../../hooks/useChat";
import MarkdownMessage from "../../MarkdownMessage";

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
  playingMessageIndex: number | null;
  playMessageAudio: (content: string, messageIndex: number) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  loading,
  playingMessageIndex,
  playMessageAudio,
}) => {
  const { user } = useAuth();

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
                conversation and let's explore what we can accomplish together.
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
                    <MarkdownMessage message={message.content} />

                    {/* Copy, Share and Audio buttons for AI responses */}
                    {message.role === "assistant" && (
                      <div className="flex items-center justify-end space-x-2 mt-4 pt-3 border-t border-white/10 flex-wrap gap-2">
                        <button
                          onClick={() => copyMessageContent(message.content)}
                          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 hover:border-[#00f5ff]/30 text-[#D0D0D0] hover:text-white transition-all duration-300 text-xs font-medium shadow-sm hover:shadow-lg hover:shadow-[#00f5ff]/10 transform hover:scale-105"
                          title="Copy message to clipboard"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Copy</span>
                        </button>
                        <button
                          onClick={() => shareMessageContent(message.content)}
                          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 hover:border-[#9d4edd]/30 text-[#D0D0D0] hover:text-white transition-all duration-300 text-xs font-medium shadow-sm hover:shadow-lg hover:shadow-[#9d4edd]/10 transform hover:scale-105"
                          title="Share this message"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Share</span>
                        </button>
                        <button
                          onClick={() =>
                            playMessageAudio(message.content, index)
                          }
                          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 hover:border-[#40e0d0]/30 text-[#D0D0D0] hover:text-white transition-all duration-300 text-xs font-medium shadow-sm hover:shadow-lg hover:shadow-[#40e0d0]/10 transform hover:scale-105 ${
                            playingMessageIndex === index
                              ? "bg-[#40e0d0]/20 border-[#40e0d0]/50 text-[#40e0d0]"
                              : ""
                          }`}
                          title={
                            playingMessageIndex === index
                              ? "Stop audio"
                              : "Play message as audio"
                          }
                        >
                          <Volume2
                            className={`h-3.5 w-3.5 ${
                              playingMessageIndex === index
                                ? "animate-pulse"
                                : ""
                            }`}
                          />
                          <span className="hidden sm:inline">
                            {playingMessageIndex === index ? "Stop" : "Listen"}
                          </span>
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
  );
};

export default ChatMessages;
