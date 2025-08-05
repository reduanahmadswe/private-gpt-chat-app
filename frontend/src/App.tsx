import { Route, Routes } from "react-router-dom";
import MobileAppEnforcer from "./components/MobileAppEnforcer";
import OAuthCallback from "./components/OAuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from "./contexts/AuthContext";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ChatView from "./pages/ChatView";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Settings from "./pages/Settings";

function App() {
  console.log("🚀 App component rendered");

  return (
    <AuthProvider>
      <MobileAppEnforcer />
      <div className="min-h-[100dvh] w-full overflow-x-hidden bg-gradient-to-br from-primary-900 via-secondary-500 to-secondary-600">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
          <Route
            path="/auth/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/auth/signin"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:chatId"
            element={
              <ProtectedRoute>
                <ChatView />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
