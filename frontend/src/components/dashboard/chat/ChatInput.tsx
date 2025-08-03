import { Send } from "lucide-react";
import React, { useState } from "react";

interface ChatInputProps {
  loading: boolean;
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ loading, onSendMessage }) => {
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim() || loading) return;
    onSendMessage(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "20px";
    target.style.height = target.scrollHeight + "px";
  };

  return (
    <div className="mx-auto">
      <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/20 shadow-2xl shadow-black/20 p-2">
        <div className="flex items-end space-x-2 lg:space-x-4">
          {/* Input field */}
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Shift + Enter for new line)"
              className="w-full px-4 lg:px-6 py-3 lg:py-4 bg-transparent text-white placeholder-[#D0D0D0] rounded-xl lg:rounded-2xl border-none focus:outline-none resize-none scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent text-sm lg:text-base leading-relaxed"
              disabled={loading}
              rows={1}
              style={{
                minHeight: "20px",
                maxHeight: "100px",
                overflow: "auto",
              }}
              onInput={handleInput}
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
            onClick={handleSendMessage}
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
        AI responses are generated and may contain inaccuracies. Please verify
        important information.
      </p>
    </div>
  );
};

export default ChatInput;
