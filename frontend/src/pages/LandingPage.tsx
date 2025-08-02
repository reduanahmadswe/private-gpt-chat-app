import {
  Brain,
  ExternalLink,
  Facebook,
  Github,
  Heart,
  Linkedin,
  Mail,
  MessageCircle,
  Shield,
  Twitter,
  Zap,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030637] via-[#1a1a2e] to-[#3C0753] text-white font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#030637]/95 via-[#16213e]/95 to-[#3C0753]/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl shadow-black/20">
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
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-24">
        <div className="text-center max-w-5xl mx-auto">
          <div className="flex justify-center mb-12">
            <div className="bg-gradient-to-br from-[#3C0753]/40 via-[#16213e]/30 to-[#030637]/40 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/30">
              <Brain className="h-24 w-24 text-[#00f5ff] drop-shadow-2xl" />
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-white via-[#00f5ff] to-white bg-clip-text text-transparent drop-shadow-2xl">
              Private GPT Chat
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-[#E0E0E0] mb-16 leading-relaxed max-w-4xl mx-auto font-light">
            Experience AI-powered conversations with complete privacy and
            security.
            <span className="text-[#00f5ff] font-medium">
              {" "}
              Your chats, your data, your control.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/auth/signup"
              className="bg-gradient-to-r from-[#00f5ff] via-[#40e0d0] to-[#9d4edd] hover:from-[#9d4edd] hover:via-[#40e0d0] hover:to-[#00f5ff] text-white text-xl px-12 py-5 rounded-2xl transition-all duration-500 inline-flex items-center justify-center shadow-2xl shadow-[#00f5ff]/30 hover:shadow-[#9d4edd]/40 transform hover:scale-105 font-bold tracking-wide"
            >
              Get Started Free
            </Link>
            <Link
              to="/auth/signin"
              className="border-2 border-white/20 hover:border-[#00f5ff]/50 hover:bg-gradient-to-r hover:from-white/5 hover:to-[#00f5ff]/10 text-white text-xl px-12 py-5 rounded-2xl transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-[#3C0753] py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] bg-clip-text text-transparent">
                Why Choose AI Bondhu?
              </span>
            </h2>
            <p className="text-xl text-[#E0E0E0] max-w-3xl mx-auto leading-relaxed font-light">
              Discover the features that make our AI chat platform the best
              choice for your conversations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-[#030637]/60 via-[#16213e]/40 to-[#3C0753]/60 backdrop-blur-sm border border-white/10 rounded-3xl p-10 text-center transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-[#00f5ff]/20 group">
              <div className="flex justify-center mb-8">
                <div className="bg-gradient-to-br from-[#00f5ff] to-[#40e0d0] rounded-2xl p-5 shadow-xl shadow-[#00f5ff]/30 group-hover:shadow-[#00f5ff]/50 transition-all duration-300">
                  <MessageCircle className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                Smart Conversations
              </h3>
              <p className="text-[#E0E0E0] leading-relaxed font-light">
                Powered by advanced AI, engage in natural, intelligent
                conversations that understand context and provide helpful
                responses.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#3C0753]/60 via-[#2a2a5e]/40 to-[#030637]/60 backdrop-blur-sm border border-white/10 rounded-3xl p-10 text-center transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-[#9d4edd]/20 group">
              <div className="flex justify-center mb-8">
                <div className="bg-gradient-to-br from-[#9d4edd] to-[#7209b7] rounded-2xl p-5 shadow-xl shadow-[#9d4edd]/30 group-hover:shadow-[#9d4edd]/50 transition-all duration-300">
                  <Shield className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                Complete Privacy
              </h3>
              <p className="text-[#E0E0E0] leading-relaxed font-light">
                Your conversations are encrypted and stored securely. Only you
                have access to your chat history and data.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#030637]/60 via-[#16213e]/40 to-[#3C0753]/60 backdrop-blur-sm border border-white/10 rounded-3xl p-10 text-center transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-[#40e0d0]/20 group">
              <div className="flex justify-center mb-8">
                <div className="bg-gradient-to-br from-[#40e0d0] to-[#00f5ff] rounded-2xl p-5 shadow-xl shadow-[#40e0d0]/30 group-hover:shadow-[#40e0d0]/50 transition-all duration-300">
                  <Zap className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                Lightning Fast
              </h3>
              <p className="text-[#E0E0E0] leading-relaxed font-light">
                Get instant responses with our optimized infrastructure. No
                waiting, just seamless conversations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div id="about" className="bg-[#030637] py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-[#3C0753]/50 via-[#16213e]/30 to-[#030637]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-16 max-w-5xl mx-auto shadow-2xl shadow-black/40">
            <h2 className="text-5xl font-bold text-white mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-white via-[#00f5ff] to-white bg-clip-text text-transparent">
                Ready to Start Your Private AI Journey?
              </span>
            </h2>
            <p className="text-xl text-[#E0E0E0] mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Join thousands of users who trust AI Bondhu for their AI
              conversations. Experience the future of private, secure AI chat
              today.
            </p>
            <Link
              to="/auth/signup"
              className="bg-gradient-to-r from-[#00f5ff] via-[#40e0d0] to-[#9d4edd] hover:from-[#9d4edd] hover:via-[#40e0d0] hover:to-[#00f5ff] text-white text-xl px-12 py-5 rounded-2xl transition-all duration-500 inline-flex items-center justify-center shadow-2xl shadow-[#00f5ff]/30 hover:shadow-[#9d4edd]/40 transform hover:scale-105 font-bold tracking-wide"
            >
              Create Your Account
            </Link>
          </div>
        </div>
      </div>

      {/* Contact with Owner Section */}
      <section
        id="contact"
        className="bg-gradient-to-br from-[#3C0753] via-[#2a2a5e] to-[#030637] py-24"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] bg-clip-text text-transparent">
                Contact with Owner
              </span>
            </h2>
            <p className="text-[#E0E0E0] text-xl max-w-3xl mx-auto leading-relaxed font-light">
              Connect with the creator of AI Bondhu. Let's discuss
              opportunities, collaborations, or just say hello!
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-[#030637]/60 via-[#16213e]/40 to-[#3C0753]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-2xl shadow-black/30">
              <div className="text-center mb-12">
                <div className="w-32 h-32 bg-gradient-to-br from-[#00f5ff] to-[#9d4edd] rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-[#00f5ff]/30">
                  <Brain className="h-16 w-16 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-3 tracking-tight">
                  <span className="bg-gradient-to-r from-white via-[#00f5ff] to-white bg-clip-text text-transparent">
                    Reduan Ahmad
                  </span>
                </h3>
                <p className="text-[#E0E0E0] text-lg font-light">
                  Full Stack Developer & AI Enthusiast
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* GitHub */}
                <a
                  href="https://github.com/reduanahmadswe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-[#030637]/70 to-[#16213e]/50 hover:from-[#16213e]/70 hover:to-[#3C0753]/50 border border-white/10 hover:border-[#00f5ff]/30 rounded-2xl p-8 transition-all duration-500 hover:scale-105 group shadow-xl hover:shadow-2xl hover:shadow-[#00f5ff]/20"
                >
                  <div className="flex flex-col items-center text-center">
                    <Github className="h-10 w-10 text-[#E0E0E0] group-hover:text-[#00f5ff] mb-4 transition-colors duration-300" />
                    <h4 className="font-bold text-white mb-2 text-lg">
                      GitHub
                    </h4>
                    <p className="text-sm text-[#E0E0E0] group-hover:text-white font-light">
                      View Projects
                    </p>
                    <ExternalLink className="h-4 w-4 text-[#00f5ff] group-hover:text-white mt-3 transition-colors duration-300" />
                  </div>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/reduanahmadswe/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-[#16213e]/70 to-[#3C0753]/50 hover:from-[#3C0753]/70 hover:to-[#2a2a5e]/50 border border-white/10 hover:border-[#9d4edd]/30 rounded-2xl p-8 transition-all duration-500 hover:scale-105 group shadow-xl hover:shadow-2xl hover:shadow-[#9d4edd]/20"
                >
                  <div className="flex flex-col items-center text-center">
                    <Linkedin className="h-10 w-10 text-[#E0E0E0] group-hover:text-[#9d4edd] mb-4 transition-colors duration-300" />
                    <h4 className="font-bold text-white mb-2 text-lg">
                      LinkedIn
                    </h4>
                    <p className="text-sm text-[#E0E0E0] group-hover:text-white font-light">
                      Professional Network
                    </p>
                    <ExternalLink className="h-4 w-4 text-[#9d4edd] group-hover:text-white mt-3 transition-colors duration-300" />
                  </div>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/reduanahmadswe/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-[#3C0753]/70 to-[#2a2a5e]/50 hover:from-[#2a2a5e]/70 hover:to-[#030637]/50 border border-white/10 hover:border-[#40e0d0]/30 rounded-2xl p-8 transition-all duration-500 hover:scale-105 group shadow-xl hover:shadow-2xl hover:shadow-[#40e0d0]/20"
                >
                  <div className="flex flex-col items-center text-center">
                    <Facebook className="h-10 w-10 text-[#E0E0E0] group-hover:text-[#40e0d0] mb-4 transition-colors duration-300" />
                    <h4 className="font-bold text-white mb-2 text-lg">
                      Facebook
                    </h4>
                    <p className="text-sm text-[#E0E0E0] group-hover:text-white font-light">
                      Social Connect
                    </p>
                    <ExternalLink className="h-4 w-4 text-[#40e0d0] group-hover:text-white mt-3 transition-colors duration-300" />
                  </div>
                </a>

                {/* Portfolio */}
                <a
                  href="https://reduanahmadswe-kappa.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-[#2a2a5e]/70 to-[#030637]/50 hover:from-[#030637]/70 hover:to-[#16213e]/50 border border-white/10 hover:border-[#00f5ff]/30 rounded-2xl p-8 transition-all duration-500 hover:scale-105 group shadow-xl hover:shadow-2xl hover:shadow-[#00f5ff]/20"
                >
                  <div className="flex flex-col items-center text-center">
                    <Brain className="h-10 w-10 text-[#E0E0E0] group-hover:text-[#00f5ff] mb-4 transition-colors duration-300" />
                    <h4 className="font-bold text-white mb-2 text-lg">
                      Portfolio
                    </h4>
                    <p className="text-sm text-[#E0E0E0] group-hover:text-white font-light">
                      My Work & Skills
                    </p>
                    <ExternalLink className="h-4 w-4 text-[#00f5ff] group-hover:text-white mt-3 transition-colors duration-300" />
                  </div>
                </a>
              </div>

              <div className="mt-12 text-center">
                <p className="text-[#E0E0E0] mb-6 text-lg font-light">
                  Open to exciting opportunities and collaborations
                </p>
                <div className="flex justify-center space-x-4 flex-wrap gap-3">
                  <span className="bg-gradient-to-r from-[#00f5ff]/20 to-[#40e0d0]/20 text-white border border-[#00f5ff]/30 px-6 py-3 rounded-2xl text-sm backdrop-blur-sm font-medium">
                    Full Stack Development
                  </span>
                  <span className="bg-gradient-to-r from-[#9d4edd]/20 to-[#7209b7]/20 text-white border border-[#9d4edd]/30 px-6 py-3 rounded-2xl text-sm backdrop-blur-sm font-medium">
                    AI Integration
                  </span>
                  <span className="bg-gradient-to-r from-[#40e0d0]/20 to-[#00f5ff]/20 text-white border border-[#40e0d0]/30 px-6 py-3 rounded-2xl text-sm backdrop-blur-sm font-medium">
                    React & Node.js
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#030637] via-[#16213e] to-[#3C0753] backdrop-blur-xl border-t border-white/10 shadow-2xl shadow-black/30">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
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
              <p className="text-[#E0E0E0] mb-6 max-w-md leading-relaxed font-light">
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
    </div>
  );
};

export default LandingPage;
