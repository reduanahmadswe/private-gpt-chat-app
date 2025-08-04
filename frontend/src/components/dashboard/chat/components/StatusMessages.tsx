import React from "react";

interface StatusMessagesProps {
  isListening: boolean;
  isVoiceMode: boolean;
  isVoiceToTextSupported: boolean;
}

const StatusMessages: React.FC<StatusMessagesProps> = ({
  isListening,
  isVoiceMode,
  isVoiceToTextSupported,
}) => {
  return (
    <div className="text-xs text-[#D0D0D0]/70 mt-3 lg:mt-4 text-center leading-relaxed transition-all duration-300">
      <p className="mb-2">
        AI responses are generated and may contain inaccuracies. Please verify
        important information.
      </p>

      {/* Dynamic Status Messages with Enhanced Styling */}
      {isListening && (
        <div className="animate-fadeIn">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-[#00f5ff]/20 to-[#00f5ff]/10 border border-[#00f5ff]/30 text-[#00f5ff] shadow-lg shadow-[#00f5ff]/20 animate-pulse">
            🎤 <strong className="mx-1">Listening...</strong> - Speak clearly,
            your voice is being converted to text
          </span>
        </div>
      )}

      {isVoiceMode && (
        <div className="animate-fadeIn">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-[#9d4edd]/20 to-[#ff6b6b]/10 border border-[#9d4edd]/30 text-[#9d4edd] shadow-lg shadow-[#9d4edd]/20">
            🎤 <strong className="mx-1">Voice Mode Active</strong> - Click the
            microphone to start talking
          </span>
        </div>
      )}

      {!isVoiceToTextSupported && (
        <div className="animate-fadeIn">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-red-500/20 to-red-400/10 border border-red-500/30 text-red-400 shadow-lg shadow-red-500/20">
            ⚠️ <strong className="mx-1">Voice input not supported</strong> -
            Your browser doesn't support speech recognition
          </span>
        </div>
      )}
    </div>
  );
};

export default StatusMessages;
