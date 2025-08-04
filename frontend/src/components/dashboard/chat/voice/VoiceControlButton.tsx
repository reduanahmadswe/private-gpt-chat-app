import { Mic, MicOff, Volume2 } from "lucide-react";
import React from "react";

export enum VoiceState {
  IDLE = "idle",
  LISTENING = "listening",
  PROCESSING = "processing",
  SPEAKING = "speaking",
}

interface VoiceControlButtonProps {
  voiceState: VoiceState;
  loading: boolean;
  onAction: () => void;
}

const VoiceControlButton: React.FC<VoiceControlButtonProps> = ({
  voiceState,
  loading,
  onAction,
}) => {
  const getButtonContent = () => {
    switch (voiceState) {
      case VoiceState.IDLE:
        return {
          icon: <Mic className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />,
          text: "Click to speak",
          className:
            "bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] hover:from-[#9d4edd] hover:to-[#00f5ff] shadow-[#00f5ff]/30",
        };
      case VoiceState.LISTENING:
        return {
          icon: <MicOff className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />,
          text: "Listening... Click to stop",
          className:
            "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/30 animate-pulse",
        };
      case VoiceState.PROCESSING:
        return {
          icon: (
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ),
          text: "Processing...",
          className:
            "bg-gradient-to-r from-yellow-500 to-orange-500 shadow-yellow-500/30",
        };
      case VoiceState.SPEAKING:
        return {
          icon: (
            <Volume2 className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 animate-pulse" />
          ),
          text: "Speaking... Click to stop",
          className:
            "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-green-500/30",
        };
    }
  };

  const buttonContent = getButtonContent();

  return (
    <button
      onClick={onAction}
      disabled={loading || voiceState === VoiceState.PROCESSING}
      className={`relative p-4 sm:p-6 md:p-8 rounded-full transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-2xl ${
        buttonContent.className
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      title={buttonContent.text}
    >
      {/* Pulsing ring for listening state */}
      {voiceState === VoiceState.LISTENING && (
        <div className="absolute inset-0 rounded-full border-4 border-white/50 animate-ping" />
      )}

      {/* Button content */}
      <div className="relative z-10 text-white">{buttonContent.icon}</div>
    </button>
  );
};

export default VoiceControlButton;
