import { Brain, Github, Heart, Mail, Twitter } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#030637] backdrop-blur-xl border-t border-white/10 shadow-2xl shadow-black/30">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-2">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="bg-gradient-to-br from-[#00f5ff] to-[#9d4edd] rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-lg shadow-[#00f5ff]/20">
                <Brain className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] bg-clip-text text-transparent">
                  AI
                </span>
                <span className="text-white ml-1">Bondhu</span>
              </span>
            </div>
            <p className="text-[#E0E0E0] mb-4 sm:mb-6 max-w-md leading-relaxed font-light text-sm sm:text-base">
              Your trusted companion for private AI conversations. Secure,
              intelligent, and always available.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-[#E0E0E0] hover:text-[#00f5ff] transition-colors duration-300 p-2 rounded-xl hover:bg-white/5"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-[#E0E0E0] hover:text-[#00f5ff] transition-colors duration-300 p-2 rounded-xl hover:bg-white/5"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="mailto:support@aibondhu.com"
                className="text-[#E0E0E0] hover:text-[#00f5ff] transition-colors duration-300 p-2 rounded-xl hover:bg-white/5"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg tracking-tight">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-[#E0E0E0] hover:text-white transition-colors duration-300 font-light"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-[#E0E0E0] hover:text-white transition-colors duration-300 font-light"
                >
                  About
                </a>
              </li>
              <li>
                <Link
                  to="/auth/signup"
                  className="text-[#E0E0E0] hover:text-white transition-colors duration-300 font-light"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/signin"
                  className="text-[#E0E0E0] hover:text-white transition-colors duration-300 font-light"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg tracking-tight">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#contact"
                  className="text-[#E0E0E0] hover:text-white transition-colors duration-300 font-light"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#E0E0E0] hover:text-white transition-colors duration-300 font-light"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#E0E0E0] hover:text-white transition-colors duration-300 font-light"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#E0E0E0] hover:text-white transition-colors duration-300 font-light"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#E0E0E0] text-sm mb-4 md:mb-0 font-light">
            © 2025 AI Bondhu. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-[#E0E0E0] text-sm font-light">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-[#00f5ff]" />
            <span>for secure conversations</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
