import React from "react";
import { Link } from "react-router-dom";

const CallToAction: React.FC = () => {
  return (
    <div id="about" className="bg-[#030637] py-24">
      <div className="container mx-auto px-6 text-center">
        <div className="bg-gradient-to-br from-[#3C0753]/50 via-[#16213e]/30 to-[#030637]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-16 max-w-5xl mx-auto shadow-2xl shadow-black/40">
          <h2 className="text-5xl font-bold text-white mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-white via-[#00f5ff] to-white bg-clip-text text-transparent">
              Ready to Start Your Private AI Journey?
            </span>
          </h2>
          <p className="text-xl text-[#E0E0E0] mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Join thousands of users who trust AI Bondhu for their AI
            conversations. Experience the future of private, secure AI chat
            today.
          </p>
          <Link
            to="/auth/signup"
            className="bg-gradient-to-r from-[#00f5ff] via-[#40e0d0] to-[#9d4edd] hover:from-[#9d4edd] hover:via-[#40e0d0] hover:to-[#00f5ff] text-white text-xl px-12 py-5 rounded-2xl transition-all duration-500 inline-flex items-center justify-center shadow-2xl shadow-[#00f5ff]/30 hover:shadow-[#9d4edd]/40 transform hover:scale-105 font-bold tracking-wide"
          >
            Create Your Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
