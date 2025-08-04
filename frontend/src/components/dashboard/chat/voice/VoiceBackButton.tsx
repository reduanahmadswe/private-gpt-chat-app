import { ArrowLeft } from "lucide-react";
import React from "react";

interface VoiceBackButtonProps {
  onExitVoiceMode: () => void;
}

const VoiceBackButton: React.FC<VoiceBackButtonProps> = ({
  onExitVoiceMode,
}) => {
  return (
    <button
      onClick={onExitVoiceMode}
      className="group absolute top-6 left-6 z-50 p-4 bg-white/10 backdrop-blur-sm rounded-full 
                 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 
                 active:scale-95 border border-white/20 hover:border-white/40
                 shadow-lg hover:shadow-xl"
    >
      <ArrowLeft className="w-6 h-6 text-white group-hover:text-purple-200 transition-colors duration-300" />
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"
      ></div>
    </button>
  );
};

export default VoiceBackButton;
