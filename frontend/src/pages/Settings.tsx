import { ArrowLeft, Crown, Lock, User } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name: string) => {
    return name.trim().length >= 2;
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validation
    const newErrors: { [key: string]: string } = {};

    if (!validateName(profileData.name)) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    if (!validateEmail(profileData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      await api.patch("/api/user/update", profileData);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);

      // Handle specific field errors
      if (error.response?.data?.field) {
        setErrors({ [error.response.data.field]: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: { [key: string]: string } = {};

    if (passwordData.currentPassword.length < 1) {
      newErrors.currentPassword = "Current password is required";
    }

    if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters long";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "New passwords do not match";
    }

    if (passwordData.newPassword === passwordData.currentPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors below");
      return;
    }

    setLoading(true);

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
      const errorMessage =
        error.response?.data?.message || "Failed to change password";
      toast.error(errorMessage);

      // Handle specific field errors
      if (error.response?.data?.field) {
        setErrors({ [error.response.data.field]: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030637] via-[#1a1a2e] to-[#16213e]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            to="/dashboard"
            className="mr-4 p-3 rounded-xl hover:bg-white/10 text-[#D0D0D0] hover:text-white transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        {/* Main Settings Card */}
        <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl shadow-black/20">
          {/* Tabs */}
          <div className="flex border-b border-white/20 p-6 pb-0">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center space-x-2 px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
                activeTab === "profile"
                  ? "bg-gradient-to-r from-[#00f5ff]/20 to-[#9d4edd]/20 border border-[#00f5ff]/30 text-white shadow-lg shadow-[#00f5ff]/10"
                  : "text-[#D0D0D0] hover:text-white hover:bg-white/10"
              }`}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => setActiveTab("password")}
              className={`flex items-center space-x-2 px-6 py-3 ml-4 font-semibold rounded-xl transition-all duration-300 ${
                activeTab === "password"
                  ? "bg-gradient-to-r from-[#00f5ff]/20 to-[#9d4edd]/20 border border-[#00f5ff]/30 text-white shadow-lg shadow-[#00f5ff]/10"
                  : "text-[#D0D0D0] hover:text-white hover:bg-white/10"
              }`}
            >
              <Lock className="h-4 w-4" />
              <span>Password</span>
            </button>

            <button
              onClick={() => setActiveTab("upgrade")}
              className={`flex items-center space-x-2 px-6 py-3 ml-4 font-semibold rounded-xl transition-all duration-300 ${
                activeTab === "upgrade"
                  ? "bg-gradient-to-r from-[#00f5ff]/20 to-[#9d4edd]/20 border border-[#00f5ff]/30 text-white shadow-lg shadow-[#00f5ff]/10"
                  : "text-[#D0D0D0] hover:text-white hover:bg-white/10"
              }`}
            >
              <Crown className="h-4 w-4" />
              <span>Upgrade</span>
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-gradient-to-br from-[#00f5ff]/20 to-[#9d4edd]/20 rounded-2xl p-3 border border-[#00f5ff]/30">
                  <User className="h-6 w-6 text-[#00f5ff]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Profile Information
                  </h2>
                  <p className="text-[#D0D0D0] text-sm">
                    Update your personal details and preferences
                  </p>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => {
                        setProfileData({
                          ...profileData,
                          name: e.target.value,
                        });
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                      className={`w-full px-4 py-3 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border text-white placeholder-[#D0D0D0] focus:outline-none transition-all duration-300 ${
                        errors.name
                          ? "border-red-500/50 focus:ring-2 focus:ring-red-500/50"
                          : "border-white/20 focus:ring-2 focus:ring-[#00f5ff]/50 focus:border-[#00f5ff]/30"
                      }`}
                      placeholder="Enter your full name"
                      required
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-2">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => {
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        });
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                      className={`w-full px-4 py-3 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border text-white placeholder-[#D0D0D0] focus:outline-none transition-all duration-300 ${
                        errors.email
                          ? "border-red-500/50 focus:ring-2 focus:ring-red-500/50"
                          : "border-white/20 focus:ring-2 focus:ring-[#00f5ff]/50 focus:border-[#00f5ff]/30"
                      }`}
                      placeholder="Enter your email address"
                      required
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#9d4edd]/10 to-[#40e0d0]/10 rounded-2xl p-4 border border-[#9d4edd]/20">
                  <h3 className="text-white font-semibold mb-2">
                    Account Status
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[#D0D0D0]">Account Type</span>
                    <span className="text-[#40e0d0] font-medium">
                      Free Plan
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[#D0D0D0]">Member Since</span>
                    <span className="text-[#D0D0D0]">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-6 py-3 bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] hover:from-[#9d4edd] hover:to-[#00f5ff] text-white rounded-2xl font-semibold transition-all duration-500 shadow-lg shadow-[#00f5ff]/20 hover:shadow-[#9d4edd]/30 transform hover:scale-105 ${
                    loading
                      ? "opacity-50 cursor-not-allowed transform-none"
                      : ""
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    "Update Profile"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-gradient-to-br from-[#9d4edd]/20 to-[#40e0d0]/20 rounded-2xl p-3 border border-[#9d4edd]/30">
                  <Lock className="h-6 w-6 text-[#9d4edd]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Change Password
                  </h2>
                  <p className="text-[#D0D0D0] text-sm">
                    Update your account password for security
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-3">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => {
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      });
                      if (errors.currentPassword)
                        setErrors({ ...errors, currentPassword: "" });
                    }}
                    className={`w-full px-4 py-3 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border text-white placeholder-[#D0D0D0] focus:outline-none transition-all duration-300 ${
                      errors.currentPassword
                        ? "border-red-500/50 focus:ring-2 focus:ring-red-500/50"
                        : "border-white/20 focus:ring-2 focus:ring-[#9d4edd]/50 focus:border-[#9d4edd]/30"
                    }`}
                    placeholder="Enter your current password"
                    required
                  />
                  {errors.currentPassword && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-3">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => {
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        });
                        if (errors.newPassword)
                          setErrors({ ...errors, newPassword: "" });
                      }}
                      className={`w-full px-4 py-3 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border text-white placeholder-[#D0D0D0] focus:outline-none transition-all duration-300 ${
                        errors.newPassword
                          ? "border-red-500/50 focus:ring-2 focus:ring-red-500/50"
                          : "border-white/20 focus:ring-2 focus:ring-[#9d4edd]/50 focus:border-[#9d4edd]/30"
                      }`}
                      placeholder="Enter new password"
                      required
                      minLength={6}
                    />
                    {errors.newPassword && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-3">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => {
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        });
                        if (errors.confirmPassword)
                          setErrors({ ...errors, confirmPassword: "" });
                      }}
                      className={`w-full px-4 py-3 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border text-white placeholder-[#D0D0D0] focus:outline-none transition-all duration-300 ${
                        errors.confirmPassword
                          ? "border-red-500/50 focus:ring-2 focus:ring-red-500/50"
                          : "border-white/20 focus:ring-2 focus:ring-[#9d4edd]/50 focus:border-[#9d4edd]/30"
                      }`}
                      placeholder="Confirm new password"
                      required
                      minLength={6}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#00f5ff]/10 to-[#9d4edd]/10 rounded-2xl p-4 border border-[#00f5ff]/20">
                  <h3 className="text-white font-semibold mb-2">
                    Password Requirements
                  </h3>
                  <ul className="text-[#D0D0D0] text-sm space-y-1">
                    <li>• Minimum 6 characters long</li>
                    <li>• Include both letters and numbers</li>
                    <li>• Use a unique password you haven't used before</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-6 py-3 bg-gradient-to-r from-[#9d4edd] to-[#40e0d0] hover:from-[#40e0d0] hover:to-[#9d4edd] text-white rounded-2xl font-semibold transition-all duration-500 shadow-lg shadow-[#9d4edd]/20 hover:shadow-[#40e0d0]/30 transform hover:scale-105 ${
                    loading
                      ? "opacity-50 cursor-not-allowed transform-none"
                      : ""
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Changing...</span>
                    </div>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Upgrade Tab */}
          {activeTab === "upgrade" && (
            <div className="p-6">
              <div className="text-center py-8">
                <div className="bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 border border-yellow-400/30">
                  <Crown className="h-12 w-12 text-yellow-400 mx-auto" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Upgrade Your Experience
                </h2>
                <p className="text-[#D0D0D0] text-lg mb-8">
                  Get access to premium features and enhanced AI capabilities.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Basic
                    </h3>
                    <div className="text-2xl font-bold text-[#D0D0D0] mb-2">
                      Free
                    </div>
                    <p className="text-[#D0D0D0] text-sm mb-4">Current Plan</p>
                    <ul className="text-[#D0D0D0] text-sm space-y-2">
                      <li>• 50 messages per day</li>
                      <li>• Basic AI responses</li>
                      <li>• Limited chat history</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-[#00f5ff]/10 to-[#9d4edd]/10 backdrop-blur-xl rounded-2xl p-6 border border-[#00f5ff]/30 transform scale-105 shadow-2xl shadow-[#00f5ff]/20">
                    <div className="bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                      RECOMMENDED
                    </div>
                    <h3 className="text-lg font-semibold text-[#00f5ff] mb-3">
                      Pro
                    </h3>
                    <div className="text-3xl font-bold text-white mb-2">
                      $9.99
                    </div>
                    <p className="text-[#D0D0D0] text-sm mb-4">per month</p>
                    <ul className="text-[#D0D0D0] text-sm space-y-2">
                      <li>• Unlimited messages</li>
                      <li>• Advanced AI responses</li>
                      <li>• Full chat history</li>
                      <li>• Priority support</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Enterprise
                    </h3>
                    <div className="text-2xl font-bold text-[#D0D0D0] mb-2">
                      $29.99
                    </div>
                    <p className="text-[#D0D0D0] text-sm mb-4">per month</p>
                    <ul className="text-[#D0D0D0] text-sm space-y-2">
                      <li>• Everything in Pro</li>
                      <li>• Team collaboration</li>
                      <li>• Custom integrations</li>
                      <li>• Dedicated support</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border border-yellow-400/30 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-3">
                    Coming Soon
                  </h3>
                  <p className="text-[#D0D0D0] text-lg">
                    We're working hard to bring you premium features. Stay tuned
                    for updates!
                  </p>
                  <div className="mt-6">
                    <button className="px-8 py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-2xl text-yellow-400 hover:from-yellow-400/30 hover:to-orange-400/30 transition-all duration-300 font-semibold">
                      Notify Me When Available
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
