import { Send } from "lucide-react";
import React from "react";

interface SendButtonProps {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
  hasMessage: boolean;
}

const SendButton: React.FC<SendButtonProps> = ({
  loading,
  disabled,
  onClick,
  hasMessage,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative group px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl transition-all duration-500 flex items-center justify-center min-w-[50px] lg:min-w-[60px] overflow-hidden ${
        disabled
          ? "bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed opacity-50"
          : "bg-gradient-to-r from-[#00f5ff] via-[#7c3aed] to-[#9d4edd] hover:from-[#9d4edd] hover:via-[#00f5ff] hover:to-[#00f5ff] shadow-lg shadow-[#00f5ff]/30 hover:shadow-[#9d4edd]/50 transform hover:scale-110 active:scale-95"
      } focus:outline-none focus:ring-2 focus:ring-[#00f5ff]/50 focus:ring-offset-2 focus:ring-offset-transparent`}
      title={
        loading
          ? "Sending..."
          : hasMessage
          ? "Send Message"
          : "Type a message to send"
      }
    >
      {/* Animated Background Glow */}
      {!loading && hasMessage && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#00f5ff]/20 via-[#7c3aed]/20 to-[#9d4edd]/20 rounded-xl lg:rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      {/* Floating particles effect */}
      {!loading && hasMessage && (
        <>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#00f5ff] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" />
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-[#9d4edd] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-100" />
          <div className="absolute top-1/2 -right-2 w-1 h-1 bg-[#7c3aed] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-200" />
        </>
      )}

      {/* Button Content */}
      <div className="relative z-10 flex items-center justify-center">
        {loading ? (
          <div className="relative">
            <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <div
              className="absolute inset-0 w-4 h-4 lg:w-5 lg:h-5 border-2 border-transparent border-t-[#00f5ff] rounded-full animate-spin animate-reverse"
              style={{ animationDuration: "0.8s" }}
            />
          </div>
        ) : (
          <Send
            className={`h-4 w-4 lg:h-5 lg:w-5 transition-all duration-300 ${
              hasMessage
                ? "text-white group-hover:text-white drop-shadow-lg group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                : "text-gray-300"
            } ${
              hasMessage
                ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                : ""
            }`}
          />
        )}
      </div>

      {/* Success ripple effect */}
      <div className="absolute inset-0 rounded-xl lg:rounded-2xl opacity-0 group-active:opacity-100 bg-gradient-to-r from-green-400/30 to-emerald-400/30 transition-opacity duration-150" />
    </button>
  );
};

export default SendButton;
