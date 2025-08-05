import { Capacitor } from "@capacitor/core";
import React from "react";
import { toast } from "react-hot-toast";
import { navigateOAuth } from "../utils/navigation";

interface FacebookLoginButtonProps {
  className?: string;
  disabled?: boolean;
}

const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({
  className = "",
  disabled = false,
}) => {
  const handleFacebookLogin = async () => {
    if (disabled) return;

    try {
      const backendUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const facebookAuthUrl = `${backendUrl}/api/auth/facebook`;

      if (Capacitor.isNativePlatform()) {
        // For mobile app - use navigation utility for smooth experience
        console.log("🔗 Starting Facebook OAuth (NO BROWSER POPUP)...");

        // Add mobile app identifier to the URL
        const mobileAuthUrl = `${facebookAuthUrl}?mobile=true&platform=capacitor`;

        // Use navigation utility for consistent experience
        await navigateOAuth(mobileAuthUrl, "Facebook");
      } else {
        // For web browser - use regular redirect
        window.location.href = facebookAuthUrl;
      }
    } catch (error) {
      console.error("❌ Facebook OAuth error:", error);
      toast.error("Failed to open Facebook login");
    }
  };

  return (
    <button
      onClick={handleFacebookLogin}
      disabled={disabled}
      className={`
        w-full flex items-center justify-center px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl
        border border-white/20 bg-[#1877F2] hover:bg-[#166FE5] 
        text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl
        disabled:opacity-50 disabled:cursor-not-allowed
        text-sm sm:text-base touch-manipulation
        ${className}
      `}
    >
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
      <span className="truncate">
        {disabled ? "Connecting..." : "Continue with Facebook"}
      </span>
    </button>
  );
};

export default FacebookLoginButton;
