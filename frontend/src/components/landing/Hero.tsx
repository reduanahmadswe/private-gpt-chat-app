import { Brain } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="text-center max-w-5xl mx-auto">
        <div className="flex justify-center mb-8 sm:mb-10 md:mb-12">
          <div className="bg-gradient-to-br from-[#3C0753]/40 via-[#16213e]/30 to-[#030637]/40 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/10 shadow-2xl shadow-black/30">
            <Brain className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 text-[#00f5ff] drop-shadow-2xl" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white mb-4 sm:mb-6 md:mb-8 tracking-tight leading-[1.1] sm:leading-tight">
          <span className="bg-gradient-to-r from-white via-[#00f5ff] to-white bg-clip-text text-transparent drop-shadow-2xl">
            Private AI Bondhu
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#E0E0E0] mb-8 sm:mb-12 md:mb-16 leading-relaxed max-w-4xl mx-auto font-light px-4">
          Experience AI-powered conversations with complete privacy and
          security.
          <span className="text-[#00f5ff] font-medium block sm:inline">
            {" "}
            Your chats, your data, your control.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center max-w-lg sm:max-w-none mx-auto px-4">
          <Link
            to="/auth/signup"
            className="w-full sm:w-auto bg-gradient-to-r from-[#00f5ff] via-[#40e0d0] to-[#9d4edd] hover:from-[#9d4edd] hover:via-[#40e0d0] hover:to-[#00f5ff] text-white text-base sm:text-lg md:text-xl px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl transition-all duration-500 inline-flex items-center justify-center shadow-2xl shadow-[#00f5ff]/30 hover:shadow-[#9d4edd]/40 transform hover:scale-105 font-bold tracking-wide min-h-[44px] mobile-touch-target"
          >
            Get Started Free
          </Link>
          <Link
            to="/auth/signin"
            className="w-full sm:w-auto border-2 border-white/20 hover:border-[#00f5ff]/50 hover:bg-gradient-to-r hover:from-white/5 hover:to-[#00f5ff]/10 text-white text-base sm:text-lg md:text-xl px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm font-semibold min-h-[44px] mobile-touch-target"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
