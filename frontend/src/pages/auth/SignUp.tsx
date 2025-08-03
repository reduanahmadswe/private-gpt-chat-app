import { ArrowLeft, Brain, Lock, Mail, User } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FacebookLoginButton from "../../components/FacebookLoginButton";
import GoogleLoginButton from "../../components/GoogleLoginButton";
import { useAuth } from "../../contexts/AuthContext";

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      navigate("/dashboard");
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030637] flex flex-col font-sans">
      {/* Header with Navigation */}
      <header className="bg-[#030637]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-[#00f5ff] to-[#9d4edd] rounded-2xl p-3 shadow-lg shadow-[#00f5ff]/20">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                <span className="bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] bg-clip-text text-transparent">
                  AI
                </span>
                <span className="ml-1">Bondhu</span>
              </span>
            </Link>

            {/* Back to Home */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-[#E0E0E0] hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all duration-300 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="bg-gradient-to-br from-[#3C0753]/50 via-[#16213e]/30 to-[#030637]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-12 max-w-lg w-full shadow-2xl shadow-black/40">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
              Create Account
            </h1>
            <p className="text-[#E0E0E0] font-light">Join AI Bondhu today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#E0E0E0]/60 transition-colors duration-300" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-6 py-4 pl-12 bg-white/5 hover:bg-white/10 text-white placeholder-[#E0E0E0]/60 rounded-2xl border border-white/20 hover:border-[#00f5ff]/50 focus:outline-none focus:ring-2 focus:ring-[#00f5ff]/50 focus:border-[#00f5ff]/50 focus:bg-white/10 backdrop-blur-sm transition-all duration-300 font-light shadow-lg hover:shadow-[#00f5ff]/10 focus:shadow-[#00f5ff]/20"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#E0E0E0]/60 transition-colors duration-300" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-6 py-4 pl-12 bg-white/5 hover:bg-white/10 text-white placeholder-[#E0E0E0]/60 rounded-2xl border border-white/20 hover:border-[#00f5ff]/50 focus:outline-none focus:ring-2 focus:ring-[#00f5ff]/50 focus:border-[#00f5ff]/50 focus:bg-white/10 backdrop-blur-sm transition-all duration-300 font-light shadow-lg hover:shadow-[#00f5ff]/10 focus:shadow-[#00f5ff]/20"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#E0E0E0]/60 transition-colors duration-300" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-6 py-4 pl-12 bg-white/5 hover:bg-white/10 text-white placeholder-[#E0E0E0]/60 rounded-2xl border border-white/20 hover:border-[#00f5ff]/50 focus:outline-none focus:ring-2 focus:ring-[#00f5ff]/50 focus:border-[#00f5ff]/50 focus:bg-white/10 backdrop-blur-sm transition-all duration-300 font-light shadow-lg hover:shadow-[#00f5ff]/10 focus:shadow-[#00f5ff]/20"
                required
                minLength={6}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#E0E0E0]/60 transition-colors duration-300" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-6 py-4 pl-12 bg-white/5 hover:bg-white/10 text-white placeholder-[#E0E0E0]/60 rounded-2xl border border-white/20 hover:border-[#00f5ff]/50 focus:outline-none focus:ring-2 focus:ring-[#00f5ff]/50 focus:border-[#00f5ff]/50 focus:bg-white/10 backdrop-blur-sm transition-all duration-300 font-light shadow-lg hover:shadow-[#00f5ff]/10 focus:shadow-[#00f5ff]/20"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-4 bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] hover:from-[#9d4edd] hover:to-[#00f5ff] text-white rounded-2xl transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-[#00f5ff] shadow-xl shadow-[#00f5ff]/30 hover:shadow-[#9d4edd]/40 transform hover:scale-105 font-semibold ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#030637] text-[#E0E0E0]/60 font-light">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {/* OAuth Login Buttons */}
          <GoogleLoginButton />

          <div className="mt-4">
            <FacebookLoginButton />
          </div>

          <div className="mt-8 text-center">
            <p className="text-[#E0E0E0] font-light">
              Already have an account?{" "}
              <Link
                to="/auth/signin"
                className="text-[#00f5ff] hover:text-[#9d4edd] transition-colors font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
