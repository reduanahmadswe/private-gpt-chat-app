import { Mic } from "lucide-react";
import React from "react";

interface VoiceModeToggleButtonProps {
  loading: boolean;
  onClick: () => void;
}

const VoiceModeToggleButton: React.FC<VoiceModeToggleButtonProps> = ({
  loading,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`relative group px-2 xs:px-3 lg:px-4 py-2 xs:py-2.5 sm:py-3 lg:py-4 rounded-xl lg:rounded-2xl transition-all duration-300 flex items-center justify-center min-w-[36px] xs:min-w-[40px] sm:min-w-[50px] lg:min-w-[60px] overflow-hidden ${
        loading
          ? "opacity-50 cursor-not-allowed bg-gradient-to-r from-[#9d4edd]/10 to-[#ff6b6b]/10"
          : "bg-gradient-to-r from-[#9d4edd]/20 to-[#ff6b6b]/20 hover:from-[#9d4edd]/40 hover:to-[#ff6b6b]/40 shadow-lg hover:shadow-[#9d4edd]/30 transform hover:scale-110 active:scale-95"
      } border border-[#9d4edd]/30 hover:border-[#9d4edd]/60 focus:outline-none focus:ring-2 focus:ring-[#9d4edd]/50 focus:ring-offset-2 focus:ring-offset-transparent`}
      title="Switch to Voice Mode"
    >
      {/* Animated Background Glow */}
      {!loading && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#9d4edd]/10 via-[#ff6b6b]/10 to-[#9d4edd]/10 rounded-xl lg:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
      )}

      {/* Floating particles effect */}
      {!loading && (
        <>
          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#9d4edd] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" />
          <div className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-[#ff6b6b] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-150" />
        </>
      )}

      {/* Button Content */}
      <div className="relative z-10">
        <Mic
          className={`h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-4 sm:w-4 lg:h-5 lg:w-5 transition-all duration-300 ${
            loading
              ? "text-[#9d4edd]/50"
              : "text-[#9d4edd] group-hover:text-white drop-shadow-sm group-hover:drop-shadow-[0_0_6px_rgba(157,78,221,0.6)]"
          } group-hover:scale-110`}
        />
      </div>

      {/* Success ripple effect */}
      <div className="absolute inset-0 rounded-xl lg:rounded-2xl opacity-0 group-active:opacity-100 bg-gradient-to-r from-[#9d4edd]/30 to-[#ff6b6b]/30 transition-opacity duration-150" />
    </button>
  );
};

export default VoiceModeToggleButton;
