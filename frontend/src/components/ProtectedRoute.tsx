import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  console.log(
    "🛡️ ProtectedRoute - isLoading:",
    isLoading,
    "user:",
    user?.email || "none"
  );

  if (isLoading) {
    console.log("🔄 ProtectedRoute - Still loading, showing spinner");
    return <LoadingSpinner />;
  }

  if (!user) {
    console.log("🚫 ProtectedRoute - No user, redirecting to signin");
    return <Navigate to="/auth/signin" replace />;
  }

  console.log(
    "✅ ProtectedRoute - User authenticated, showing protected content"
  );
  return <>{children}</>;
};

export default ProtectedRoute;
