import { Brain, Github, Mail, Twitter } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#030637] backdrop-blur-xl border-t border-white/10 shadow-2xl shadow-black/30">
      <div className="mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="bg-gradient-to-br from-[#00f5ff] to-[#9d4edd] rounded-xl p-2 shadow-lg shadow-[#00f5ff]/20">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] bg-clip-text text-transparent">AI</span>
                <span className="text-white ml-1">Bondhu</span>
              </span>
            </div>
            <p className="text-[#E0E0E0] mb-4 leading-relaxed font-light text-sm sm:text-base max-w-sm">
              Your trusted companion for private AI conversations. Secure,
              intelligent, and always available.
            </p>
            <div className="flex space-x-3 mt-2">
              <a href="#" className="text-[#E0E0E0] hover:text-[#00f5ff] p-2 rounded-lg hover:bg-white/5">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-[#E0E0E0] hover:text-[#00f5ff] p-2 rounded-lg hover:bg-white/5">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="mailto:support@aibondhu.com" className="text-[#E0E0E0] hover:text-[#00f5ff] p-2 rounded-lg hover:bg-white/5">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-[#E0E0E0] hover:text-white font-light">Features</a>
              </li>
              <li>
                <a href="#about" className="text-[#E0E0E0] hover:text-white font-light">About</a>
              </li>
              <li>
                <Link to="/auth/signup" className="text-[#E0E0E0] hover:text-white font-light">Sign Up</Link>
              </li>
              <li>
                <Link to="/auth/signin" className="text-[#E0E0E0] hover:text-white font-light">Sign In</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#contact" className="text-[#E0E0E0] hover:text-white font-light">Contact Us</a>
              </li>
              <li>
                <a href="#" className="text-[#E0E0E0] hover:text-white font-light">Help Center</a>
              </li>
              <li>
                <a href="#" className="text-[#E0E0E0] hover:text-white font-light">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-[#E0E0E0] hover:text-white font-light">Report Issue</a>
              </li>
            </ul>
          </div>

          {/* Contact Info + Newsletter */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Contact</h3>
            <div className="text-[#E0E0E0] space-y-3 text-sm font-light">
              <div className="flex items-start gap-3">
                <div className="text-[#00f5ff] mt-1">📍</div>
                <div>123 Main Street, Dhaka 1000, Bangladesh</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-[#00f5ff] mt-1">📞</div>
                <div>+880 1700-000000</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-[#00f5ff] mt-1">✉️</div>
                <div>info@aibondhu.com</div>
              </div>

              <div className="pt-2">
                <label className="block text-sm text-[#E0E0E0] mb-2">Newsletter</label>
                <div className="flex items-center space-x-2">
                  <input type="email" placeholder="Your email" className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-white placeholder:text-white/40 border border-white/5 focus:outline-none" />
                  <button className="bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] text-white px-4 py-2 rounded-lg">Subscribe</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[#A8A8A8]">© {new Date().getFullYear()} AI Bondhu. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[#A8A8A8] hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="text-[#A8A8A8] hover:text-white text-sm">Terms</a>
            <a href="#" className="text-[#A8A8A8] hover:text-white text-sm">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
