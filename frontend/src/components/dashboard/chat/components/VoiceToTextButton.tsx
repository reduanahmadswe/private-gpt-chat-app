import { Mic } from "lucide-react";
import React from "react";

interface VoiceToTextButtonProps {
  isListening: boolean;
  isSupported: boolean;
  loading: boolean;
  onClick: () => void;
}

const VoiceToTextButton: React.FC<VoiceToTextButtonProps> = ({
  isListening,
  isSupported,
  loading,
  onClick,
}) => {
  if (!isSupported) return null;

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 z-10 p-1.5 rounded-lg transition-all duration-300 group ${
        isListening
          ? "text-red-500 bg-red-500/20 animate-pulse shadow-lg shadow-red-500/30 scale-110"
          : "text-[#D0D0D0] hover:text-[#00f5ff] hover:bg-[#00f5ff]/15 hover:shadow-md hover:shadow-[#00f5ff]/20 hover:scale-110"
      } ${loading ? "opacity-50 cursor-not-allowed" : "active:scale-95"}`}
      title={isListening ? "Stop voice input" : "Click to speak"}
    >
      <Mic
        className={`h-4 w-4 lg:h-5 lg:w-5 transition-all duration-300 ${
          isListening
            ? "drop-shadow-[0_0_4px_rgba(239,68,68,0.8)]"
            : "group-hover:drop-shadow-[0_0_4px_rgba(0,245,255,0.6)]"
        }`}
      />

      {/* Listening indicator rings */}
      {isListening && (
        <>
          <div className="absolute inset-0 rounded-lg border-2 border-red-400/50 animate-ping" />
          <div className="absolute inset-0 rounded-lg border border-red-300/30 animate-pulse" />
        </>
      )}

      {/* Hover glow effect */}
      {!isListening && !loading && (
        <div className="absolute inset-0 rounded-lg bg-[#00f5ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  );
};

export default VoiceToTextButton;
