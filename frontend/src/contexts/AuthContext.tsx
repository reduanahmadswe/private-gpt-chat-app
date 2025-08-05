import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { User } from "../types/auth";
import { api } from "../utils/api";
import { cleanupNavigation, navigateOAuth } from "../utils/navigation";

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

  console.log("🚀 AuthProvider rendered, isLoading:", isLoading);

  // Force app to load after maximum 3 seconds - NO MORE BLANK SCREEN!
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log("🔥 TIMEOUT REACHED - FORCING APP TO LOAD!");
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  const checkAuth = async () => {
    console.log("🔍 Starting auth check...");

    try {
      // Quick OAuth check
      const urlParams = new URLSearchParams(window.location.search);
      const authSuccess = urlParams.get("auth");
      const urlToken = urlParams.get("token");
      const provider = urlParams.get("provider");

      if (authSuccess === "success" && urlToken) {
        console.log("🔑 Processing OAuth callback");
        localStorage.setItem("token", urlToken);

        // Use navigation utility to cleanup all overlays
        cleanupNavigation();

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        if (provider) {
          toast.success(`Logged in with ${provider}!`);
        }
      }

      // Quick token check
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("🔍 No token found");
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Quick API check (with timeout)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second API timeout

        const response = await api.get("/api/auth/me", {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        console.log("✅ User authenticated");
        setUser(response.data.user);

        // Remove any OAuth loading overlays when user is authenticated
        const oauthLoading = document.getElementById("oauth-loading");
        if (oauthLoading) {
          document.body.removeChild(oauthLoading);
          console.log("🗑️ Removed OAuth loading overlay after authentication");
        }

        const facebookLoading = document.getElementById(
          "facebook-oauth-loading"
        );
        if (facebookLoading) {
          document.body.removeChild(facebookLoading);
          console.log(
            "🗑️ Removed Facebook loading overlay after authentication"
          );
        }
      } catch (error) {
        console.log("⚠️ API check failed, continuing...");
        setUser(null);
      }
    } catch (error) {
      console.log("❌ Auth check error, continuing...");
      setUser(null);
    } finally {
      console.log("✅ Auth check complete");
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await api.post("/api/auth/signin", { email, password });
      const { user, token, refreshToken } = response.data;

      if (token) localStorage.setItem("token", token);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      setUser(user);
      toast.success("Successfully logged in!");
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
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
      const response = await api.post("/api/auth/signup", {
        name: username,
        email,
        password,
      });
      const { user, token, refreshToken } = response.data;

      if (token) localStorage.setItem("token", token);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      setUser(user);
      toast.success("Account created successfully!");
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    if (isLoggingOut) return;
    try {
      setIsLoggingOut(true);
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setIsLoggingOut(false);
      toast.success("Logged out successfully");
    }
  };

  const forceLogout = () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setIsLoggingOut(false);
  };

  const googleLogin = async () => {
    try {
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
      const googleAuthUrl = `${baseUrl}/api/auth/google`;

      // Check if we're in the actual mobile app (not web browser)
      if (Capacitor.isNativePlatform()) {
        // Add mobile identifier and force mobile mode
        const mobileAuthUrl = `${googleAuthUrl}?mobile=true&platform=capacitor`;

        // Use navigation utility for smooth experience
        await navigateOAuth(mobileAuthUrl, "Google");

        // Also listen for custom URL scheme
        try {
          const { App } = await import("@capacitor/app");

          App.addListener("appUrlOpen", (event: any) => {
            console.log("🔗 Deep link received:", event.url);

            if (event.url.includes("aibondhu://auth/callback")) {
              const url = new URL(event.url);
              const token = url.searchParams.get("token");
              const provider = url.searchParams.get("provider");

              if (token && provider) {
                console.log(`🎉 ${provider} OAuth success via deep link!`);
                localStorage.setItem("token", token);

                // Use navigation utility to cleanup all overlays
                cleanupNavigation();

                checkAuth();
                toast.success(`Successfully logged in with ${provider}!`);
                Browser.close();
              }
            }
          });
        } catch (appError) {
          console.log("App plugin not available:", appError);
        }
      } else {
        console.log("🌐 Opening Google OAuth in WEB BROWSER...");
        // For web browser testing - this is what you see in tau.vercel.app
        window.location.href = googleAuthUrl;
      }
    } catch (error) {
      console.error("❌ OAuth error:", error);
      toast.error("Failed to open login");
    }
  };

  useEffect(() => {
    console.log("🎯 Starting auth initialization...");
    checkAuth();
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

  // SIMPLE LOADING - GUARANTEED TO WORK!
  if (isLoading) {
    console.log("📱 Showing loading...");
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #030637, #1e3a8a)",
          color: "white",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #00f5ff",
              borderTop: "4px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          ></div>
          <h1 style={{ margin: "0 0 8px", fontSize: "20px" }}>AI Bondhu</h1>
          <p style={{ margin: 0, fontSize: "14px", opacity: 0.8 }}>
            Loading...
          </p>
          <style
            dangerouslySetInnerHTML={{
              __html:
                "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }",
            }}
          />
        </div>
      </div>
    );
  }

  console.log("🎯 App loaded! User:", user ? user.email : "none");
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
