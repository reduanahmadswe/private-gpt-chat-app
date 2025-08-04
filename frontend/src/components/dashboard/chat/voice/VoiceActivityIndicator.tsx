import React from "react";
import { VoiceState } from "./VoiceControlButton";

interface VoiceActivityIndicatorProps {
  voiceState: VoiceState;
}

const VoiceActivityIndicator: React.FC<VoiceActivityIndicatorProps> = ({
  voiceState,
}) => {
  const isActive =
    voiceState === VoiceState.LISTENING ||
    voiceState === VoiceState.PROCESSING ||
    voiceState === VoiceState.SPEAKING;

  return (
    <div className="relative flex items-center justify-center">
      {/* Main pulsing rings */}
      {isActive && (
        <>
          <div className="absolute w-32 h-32 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full animate-ping"></div>
          <div
            className="absolute w-48 h-48 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-ping"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute w-64 h-64 bg-gradient-to-r from-pink-500/10 to-blue-500/10 rounded-full animate-ping"
            style={{ animationDelay: "1s" }}
          ></div>
        </>
      )}

      {/* Sound wave visualization */}
      {voiceState === VoiceState.LISTENING && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-end space-x-1">
            {[...Array(7)].map((_, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-purple-400 to-pink-400 rounded-full animate-pulse"
                style={{
                  width: "4px",
                  height: `${Math.random() * 40 + 20}px`,
                  animationDelay: `${index * 0.1}s`,
                  animationDuration: "0.5s",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Processing spinner */}
      {voiceState === VoiceState.PROCESSING && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-purple-400 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Speaking indicator */}
      {voiceState === VoiceState.SPEAKING && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="w-3 h-8 bg-gradient-to-t from-blue-400 to-purple-400 rounded-full animate-bounce"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceActivityIndicator;
