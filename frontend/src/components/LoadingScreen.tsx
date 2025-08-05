import React from "react";

const LoadingScreen: React.FC = () => {
  console.log("🔄 LoadingScreen component rendered");

  return (
    <div
      className="min-h-[100dvh] w-full flex items-center justify-center bg-gradient-to-br from-[#030637] via-[#1e3a8a] to-[#3730a3]"
      style={{
        background:
          "linear-gradient(135deg, #030637 0%, #1e3a8a 50%, #3730a3 100%)",
        minHeight: "100dvh",
      }}
    >
      <div className="text-center space-y-6 p-4">
        {/* AI Bondhu Logo/Icon */}
        <div className="relative">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-2xl">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center animate-pulse">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
          </div>
          {/* Glowing ring animation */}
          <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-cyan-400 rounded-full animate-ping opacity-20"></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">AI Bondhu</h1>
          <p className="text-sm text-gray-300 animate-pulse">
            Loading your AI companion...
          </p>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>

        {/* Debug info */}
        <div className="text-xs text-gray-400 mt-4">Initializing app...</div>
      </div>
    </div>
  );
};

export default LoadingScreen;
