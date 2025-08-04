import React from "react";
import { VoiceState } from "./VoiceControlButton";

interface VoiceStatusDisplayProps {
  voiceState: VoiceState;
}

const VoiceStatusDisplay: React.FC<VoiceStatusDisplayProps> = ({
  voiceState,
}) => {
  const getStatusContent = () => {
    switch (voiceState) {
      case VoiceState.IDLE:
        return {
          title: "Ready to chat",
          description: "Click the microphone to start voice conversation",
        };
      case VoiceState.LISTENING:
        return {
          title: "Listening...",
          description: "Speak clearly and wait for processing",
        };
      case VoiceState.PROCESSING:
        return {
          title: "Thinking...",
          description: "AI is generating response...",
        };
      case VoiceState.SPEAKING:
        return {
          title: "Speaking...",
          description: "Playing AI response",
        };
    }
  };

  const { title, description } = getStatusContent();

  return (
    <div className="text-center">
      <p className="text-white font-medium text-xl lg:text-2xl mb-2">{title}</p>
      <p className="text-white/60 text-base lg:text-lg">{description}</p>
    </div>
  );
};

export default VoiceStatusDisplay;
