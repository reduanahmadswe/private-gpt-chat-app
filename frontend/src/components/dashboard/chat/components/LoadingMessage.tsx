import { MessageCircle } from "lucide-react";
import React from "react";

const LoadingMessage: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="flex items-start space-x-2 lg:space-x-4 max-w-3xl lg:max-w-4xl">
        <div className="bg-gradient-to-br from-[#00f5ff]/20 to-[#9d4edd]/20 rounded-xl lg:rounded-2xl p-2 lg:p-3 border border-[#00f5ff]/30 flex-shrink-0">
          <MessageCircle className="h-4 w-4 lg:h-5 lg:w-5 text-[#00f5ff]" />
        </div>
        <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/10 text-white p-4 lg:p-6 rounded-2xl lg:rounded-3xl shadow-lg">
          <div className="flex items-center space-x-2 lg:space-x-3">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-[#00f5ff] rounded-full animate-bounce"></div>
              <div
                className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-[#9d4edd] rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-[#40e0d0] rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <span className="text-[#D0D0D0] font-medium text-sm lg:text-base">
              Thinking...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;
