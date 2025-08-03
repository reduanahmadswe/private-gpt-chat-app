import React from "react";

interface FacebookLoginButtonProps {
  className?: string;
  disabled?: boolean;
}

const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({
  className = "",
  disabled = false,
}) => {
  const handleFacebookLogin = () => {
    if (disabled) return;

    // Redirect to Facebook OAuth endpoint
    const backendUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    window.location.href = `${backendUrl}/api/auth/facebook`;
  };

  return (
    <button
      onClick={handleFacebookLogin}
      disabled={disabled}
      className={`
        w-full flex items-center justify-center px-4 py-3 rounded-lg
        border border-gray-300 bg-[#1877F2] hover:bg-[#166FE5] 
        text-white font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
      {disabled ? "Connecting..." : "Continue with Facebook"}
    </button>
  );
};

export default FacebookLoginButton;
