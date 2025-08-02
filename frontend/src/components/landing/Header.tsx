import { Brain } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="bg-[#030637]/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl shadow-black/20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-[#00f5ff] to-[#9d4edd] rounded-2xl p-3 shadow-lg shadow-[#00f5ff]/20">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] bg-clip-text text-transparent">
                AI
              </span>
              <span className="text-white ml-1">Bondhu</span>
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <a
              href="#features"
              className="text-[#E0E0E0] hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all duration-300 font-medium"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-[#E0E0E0] hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all duration-300 font-medium"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-[#E0E0E0] hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all duration-300 font-medium"
            >
              Contact
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/auth/signin"
              className="text-[#E0E0E0] hover:text-white hover:bg-white/10 px-5 py-2.5 rounded-xl transition-all duration-300 font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/auth/signup"
              className="bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] hover:from-[#9d4edd] hover:to-[#00f5ff] text-white px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-[#00f5ff]/25 hover:shadow-xl hover:shadow-[#9d4edd]/30 transform hover:scale-105 font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
