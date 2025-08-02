import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const processOAuth = async () => {
      try {
        // Check for OAuth callback parameters
        const urlParams = new URLSearchParams(window.location.search);
        const authSuccess = urlParams.get("auth");
        const token = urlParams.get("token");
        const provider = urlParams.get("provider");

        if (authSuccess === "success" && token && provider === "google") {
          // Store the token
          localStorage.setItem("token", token);

          // Clean up URL parameters
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );

          // Trigger auth check to update user state
          await checkAuth();

          // Show success message
          toast.success("Successfully logged in with Google!");

          // Navigate to dashboard
          navigate("/dashboard", { replace: true });
        } else {
          // No OAuth callback detected or failed, redirect to signin
          navigate("/auth/signin", { replace: true });
        }
      } catch (error) {
        console.error("OAuth processing error:", error);
        toast.error("Authentication failed");
        navigate("/auth/signin", { replace: true });
      }
    };

    processOAuth();
  }, [checkAuth, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
