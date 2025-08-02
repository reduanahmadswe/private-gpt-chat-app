import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { User } from "../types/auth";
import { api, authEventEmitter } from "../utils/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  forceLogout: () => void;
  checkAuth: () => Promise<void>;
  googleLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const checkAuth = async () => {
    try {
      // First, check if we have an OAuth callback token in the URL
      const urlParams = new URLSearchParams(window.location.search);
      const authSuccess = urlParams.get("auth");
      const urlToken = urlParams.get("token");
      const provider = urlParams.get("provider");

      // If OAuth callback is present, process it first
      if (authSuccess === "success" && urlToken && provider === "google") {
        console.log(
          "🔑 Processing OAuth callback with token:",
          urlToken.substring(0, 20) + "..."
        );

        // Store the token
        localStorage.setItem("token", urlToken);

        // Clean up URL parameters
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        // Show success message
        toast.success("Successfully logged in with Google!");

        console.log("✅ OAuth callback processed, now checking auth...");
      }

      // Check if there's a token in localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        // No token means user is not logged in
        console.log("🔍 No token found, user not authenticated");
        setUser(null);
        setIsLoading(false);
        return;
      }

      console.log("🔍 Token found, checking authentication...");
      const response = await api.get("/auth/me");
      console.log("✅ User authenticated:", response.data.user.email);
      setUser(response.data.user);
    } catch (error) {
      console.error("❌ Authentication check failed:", error);
      setUser(null);
      // Clear invalid token from localStorage
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await api.post("/auth/signin", { email, password });
      const { user, token } = response.data;

      // Store token in localStorage
      if (token) {
        localStorage.setItem("token", token);
      }

      setUser(user);
      toast.success("Successfully logged in!");
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await api.post("/auth/signup", {
        name: username,
        email,
        password,
      });
      const { user, token } = response.data;

      // Store token in localStorage
      if (token) {
        localStorage.setItem("token", token);
      }

      setUser(user);
      toast.success("Account created successfully!");
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("token");
      setIsLoggingOut(false);
      toast.success("Logged out successfully");
    }
  };

  const forceLogout = () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setUser(null);
    localStorage.removeItem("token");

    // Show session expired toast only if we haven't already shown it
    if (!window.location.pathname.includes("/auth/")) {
      toast.error("Session expired. Please sign in again.");
    }

    setIsLoggingOut(false);
  };

  const googleLogin = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"
    }/auth/google`;
  };

  useEffect(() => {
    checkAuth();

    // Listen for OAuth success events
    const handleOAuthSuccess = () => {
      console.log("🎉 OAuth success event received, checking auth...");
      checkAuth();
    };

    window.addEventListener("oauth-success", handleOAuthSuccess);

    return () => {
      window.removeEventListener("oauth-success", handleOAuthSuccess);
    };
  }, []);

  useEffect(() => {
    const handleSessionExpiry = () => {
      forceLogout();
    };

    authEventEmitter.on("sessionExpired", handleSessionExpiry);

    return () => {
      authEventEmitter.off("sessionExpired", handleSessionExpiry);
    };
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    forceLogout,
    checkAuth,
    googleLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
