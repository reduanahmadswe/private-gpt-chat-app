import { Brain } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-24">
      <div className="text-center max-w-5xl mx-auto">
        <div className="flex justify-center mb-12">
          <div className="bg-gradient-to-br from-[#3C0753]/40 via-[#16213e]/30 to-[#030637]/40 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/30">
            <Brain className="h-24 w-24 text-[#00f5ff] drop-shadow-2xl" />
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-white via-[#00f5ff] to-white bg-clip-text text-transparent drop-shadow-2xl">
            Private AI Bondhu
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-[#E0E0E0] mb-16 leading-relaxed max-w-4xl mx-auto font-light">
          Experience AI-powered conversations with complete privacy and
          security.
          <span className="text-[#00f5ff] font-medium">
            {" "}
            Your chats, your data, your control.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            to="/auth/signup"
            className="bg-gradient-to-r from-[#00f5ff] via-[#40e0d0] to-[#9d4edd] hover:from-[#9d4edd] hover:via-[#40e0d0] hover:to-[#00f5ff] text-white text-xl px-12 py-5 rounded-2xl transition-all duration-500 inline-flex items-center justify-center shadow-2xl shadow-[#00f5ff]/30 hover:shadow-[#9d4edd]/40 transform hover:scale-105 font-bold tracking-wide"
          >
            Get Started Free
          </Link>
          <Link
            to="/auth/signin"
            className="border-2 border-white/20 hover:border-[#00f5ff]/50 hover:bg-gradient-to-r hover:from-white/5 hover:to-[#00f5ff]/10 text-white text-xl px-12 py-5 rounded-2xl transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
