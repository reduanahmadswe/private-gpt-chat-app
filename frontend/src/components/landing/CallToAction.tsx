import React from "react";
import { Link } from "react-router-dom";

const CallToAction: React.FC = () => {
  return (
    <div
      id="about"
      className="w-full flex-1 flex items-center justify-center px-4 sm:px-6"
    >
      <div className="w-full max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-br from-[#3C0753]/50 via-[#16213e]/30 to-[#030637]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl shadow-black/40">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 sm:mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-white via-[#00f5ff] to-white bg-clip-text text-transparent">
              Ready to Start Your Private AI Journey?
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#E0E0E0] mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed font-light px-4">
            Join thousands of users who trust AI Bondhu for their AI
            conversations. Experience the future of private, secure AI chat
            today.
          </p>
          <Link
            to="/auth/signup"
            className="bg-gradient-to-r from-[#00f5ff] via-[#40e0d0] to-[#9d4edd] hover:from-[#9d4edd] hover:via-[#40e0d0] hover:to-[#00f5ff] text-white text-lg sm:text-xl px-8 sm:px-10 md:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl transition-all duration-500 inline-flex items-center justify-center shadow-2xl shadow-[#00f5ff]/30 hover:shadow-[#9d4edd]/40 transform hover:scale-105 font-bold tracking-wide w-full sm:w-auto"
          >
            Create Your Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
