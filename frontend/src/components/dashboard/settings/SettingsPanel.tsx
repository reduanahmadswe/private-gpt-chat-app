import { Lock, LogOut, User } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../utils/api";

interface SettingsPanelProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  showSettings,
  setShowSettings,
}) => {
  const { user, logout } = useAuth();
  const [settingsTab, setSettingsTab] = useState("account");
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [settingsLoading, setSettingsLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);

    try {
      await api.patch("/api/user/update", profileData);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSettingsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    setSettingsLoading(true);

    try {
      await api.patch("/api/user/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setSettingsLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 sm:right-0 sm:top-0 sm:h-full sm:inset-auto w-full sm:w-80 md:w-96 lg:w-[450px] bg-gradient-to-b from-[#030637] to-[#2a1a3e] backdrop-blur-xl border-l border-white/10 z-30 shadow-2xl shadow-black/20 transform transition-transform duration-300 flex flex-col ${
        showSettings ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Mobile Overlay */}
      {showSettings && (
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm sm:hidden"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Fixed Header */}
      <div className="relative p-4 sm:p-6 border-b border-white/10 flex-shrink-0 bg-gradient-to-r from-[#030637]/90 to-[#16213e]/90 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white">Settings</h2>
          <button
            onClick={() => setShowSettings(false)}
            className="text-[#D0D0D0] hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-300 mobile-touch-target"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 pb-8">
          {/* Settings Tabs */}
          <div className="flex space-x-1 sm:space-x-2 border-b border-white/20 pb-3 sm:pb-4">
            <button
              onClick={() => setSettingsTab("account")}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 text-xs sm:text-sm mobile-touch-target ${
                settingsTab === "account"
                  ? "bg-gradient-to-r from-[#00f5ff]/20 to-[#9d4edd]/20 border border-[#00f5ff]/30 text-white"
                  : "text-[#D0D0D0] hover:text-white hover:bg-white/10"
              }`}
            >
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Account</span>
            </button>
            <button
              onClick={() => setSettingsTab("password")}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 text-xs sm:text-sm mobile-touch-target ${
                settingsTab === "password"
                  ? "bg-gradient-to-r from-[#00f5ff]/20 to-[#9d4edd]/20 border border-[#00f5ff]/30 text-white"
                  : "text-[#D0D0D0] hover:text-white hover:bg-white/10"
              }`}
            >
              <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Password</span>
            </button>
          </div>

          {/* Account Tab */}
          {settingsTab === "account" && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-3 sm:mb-4 flex items-center space-x-2 text-sm sm:text-base">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Profile Information</span>
                </h3>

                <form
                  onSubmit={handleProfileUpdate}
                  className="space-y-3 sm:space-y-4"
                >
                  <div>
                    <label className="block text-[#D0D0D0] text-xs sm:text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 sm:py-2.5 bg-white/5 text-white placeholder-[#D0D0D0] rounded-lg sm:rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00f5ff]/50 focus:border-[#00f5ff]/30 transition-all duration-300 text-xs sm:text-sm mobile-touch-target"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#D0D0D0] text-xs sm:text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 sm:py-2.5 bg-white/5 text-white placeholder-[#D0D0D0] rounded-lg sm:rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00f5ff]/50 focus:border-[#00f5ff]/30 transition-all duration-300 text-xs sm:text-sm mobile-touch-target"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={settingsLoading}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] hover:from-[#9d4edd] hover:to-[#00f5ff] text-white rounded-lg sm:rounded-xl font-medium transition-all duration-500 shadow-lg shadow-[#00f5ff]/20 hover:shadow-[#9d4edd]/30 transform hover:scale-105 text-xs sm:text-sm mobile-touch-target ${
                      settingsLoading
                        ? "opacity-50 cursor-not-allowed transform-none"
                        : ""
                    }`}
                  >
                    {settingsLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Updating...</span>
                      </div>
                    ) : (
                      "Update Profile"
                    )}
                  </button>
                </form>
              </div>

              {/* Current Account Info */}
              <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-3">
                  Account Status
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2">
                    <span className="text-[#D0D0D0] text-sm">Plan</span>
                    <span className="text-[#40e0d0] font-medium text-sm">
                      Free
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="text-[#D0D0D0] text-sm">Member Since</span>
                    <span className="text-white text-sm">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Password Tab */}
          {settingsTab === "password" && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Change Password</span>
                </h3>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-[#D0D0D0] text-sm font-medium mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white/5 text-white placeholder-[#D0D0D0] rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#9d4edd]/50 focus:border-[#9d4edd]/30 transition-all duration-300 text-sm"
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#D0D0D0] text-sm font-medium mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white/5 text-white placeholder-[#D0D0D0] rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#9d4edd]/50 focus:border-[#9d4edd]/30 transition-all duration-300 text-sm"
                      placeholder="Enter new password"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-[#D0D0D0] text-sm font-medium mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white/5 text-white placeholder-[#D0D0D0] rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#9d4edd]/50 focus:border-[#9d4edd]/30 transition-all duration-300 text-sm"
                      placeholder="Confirm new password"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="bg-gradient-to-r from-[#00f5ff]/10 to-[#9d4edd]/10 rounded-xl p-3 border border-[#00f5ff]/20">
                    <h4 className="text-white font-medium mb-2 text-sm">
                      Password Requirements
                    </h4>
                    <ul className="text-[#D0D0D0] text-xs space-y-1">
                      <li>• Minimum 6 characters long</li>
                      <li>• Include both letters and numbers</li>
                      <li>• Use a unique password</li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    disabled={settingsLoading}
                    className={`w-full px-4 py-2 bg-gradient-to-r from-[#9d4edd] to-[#40e0d0] hover:from-[#40e0d0] hover:to-[#9d4edd] text-white rounded-xl font-medium transition-all duration-500 shadow-lg shadow-[#9d4edd]/20 hover:shadow-[#40e0d0]/30 transform hover:scale-105 text-sm ${
                      settingsLoading
                        ? "opacity-50 cursor-not-allowed transform-none"
                        : ""
                    }`}
                  >
                    {settingsLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Changing...</span>
                      </div>
                    ) : (
                      "Change Password"
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* AI Model Info */}
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-3">AI Model</h3>
            <div className="bg-gradient-to-r from-[#00f5ff]/10 to-[#9d4edd]/10 rounded-xl p-3 border border-[#00f5ff]/20">
              <p className="text-[#00f5ff] font-medium text-sm">
                Claude 3.5 Sonnet
              </p>
              <p className="text-[#D0D0D0] text-xs">
                Advanced reasoning and analysis
              </p>
            </div>
          </div>

          {/* Export Data */}
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-3">Data Export</h3>
            <button className="w-full p-3 bg-gradient-to-r from-[#9d4edd]/20 to-[#40e0d0]/20 border border-[#9d4edd]/30 rounded-xl text-white hover:from-[#9d4edd]/30 hover:to-[#40e0d0]/30 transition-all duration-300 text-sm">
              Export Chat History
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full p-3 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl text-red-400 hover:from-red-500/30 hover:to-red-600/30 hover:text-red-300 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
