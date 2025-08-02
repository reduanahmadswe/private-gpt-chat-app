import { MessageCircle, Shield, Zap } from "lucide-react";
import React from "react";

const Features: React.FC = () => {
  return (
    <div id="features" className="bg-[#030637] py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] bg-clip-text text-transparent">
              Why Choose AI Bondhu?
            </span>
          </h2>
          <p className="text-xl text-[#E0E0E0] max-w-3xl mx-auto leading-relaxed font-light">
            Discover the features that make our AI chat platform the best choice
            for your conversations
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-[#030637]/60 via-[#16213e]/40 to-[#3C0753]/60 backdrop-blur-sm border border-white/10 rounded-3xl p-10 text-center transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-[#00f5ff]/20 group">
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-br from-[#00f5ff] to-[#40e0d0] rounded-2xl p-5 shadow-xl shadow-[#00f5ff]/30 group-hover:shadow-[#00f5ff]/50 transition-all duration-300">
                <MessageCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
              Smart Conversations
            </h3>
            <p className="text-[#E0E0E0] leading-relaxed font-light">
              Powered by advanced AI, engage in natural, intelligent
              conversations that understand context and provide helpful
              responses.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#3C0753]/60 via-[#2a2a5e]/40 to-[#030637]/60 backdrop-blur-sm border border-white/10 rounded-3xl p-10 text-center transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-[#9d4edd]/20 group">
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-br from-[#9d4edd] to-[#7209b7] rounded-2xl p-5 shadow-xl shadow-[#9d4edd]/30 group-hover:shadow-[#9d4edd]/50 transition-all duration-300">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
              Complete Privacy
            </h3>
            <p className="text-[#E0E0E0] leading-relaxed font-light">
              Your conversations are encrypted and stored securely. Only you
              have access to your chat history and data.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#030637]/60 via-[#16213e]/40 to-[#3C0753]/60 backdrop-blur-sm border border-white/10 rounded-3xl p-10 text-center transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-[#40e0d0]/20 group">
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-br from-[#40e0d0] to-[#00f5ff] rounded-2xl p-5 shadow-xl shadow-[#40e0d0]/30 group-hover:shadow-[#40e0d0]/50 transition-all duration-300">
                <Zap className="h-12 w-12 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
              Lightning Fast
            </h3>
            <p className="text-[#E0E0E0] leading-relaxed font-light">
              Get instant responses with our optimized infrastructure. No
              waiting, just seamless conversations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
