import { MessageCircle } from "lucide-react";
import React from "react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex w-full mb-3 animate-slideUp justify-start">
      <div className="flex items-start max-w-[75%] lg:max-w-[60%] flex-row gap-2">
        {/* Assistant Avatar */}
        <div className="bg-gradient-to-br from-slate-100/10 to-slate-200/10 rounded-full p-2 border border-white/10 flex-shrink-0 shadow-lg">
          <MessageCircle className="h-4 w-4 text-cyan-400" />
        </div>

        {/* Typing Bubble */}
        <div className="flex flex-col">
          <div className="relative backdrop-blur-sm border shadow-lg px-4 py-3 rounded-2xl rounded-bl-md bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-slate-600/30">
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-typing"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-typing"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
              <span className="text-xs text-gray-400 ml-2">
                AI is typing...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
