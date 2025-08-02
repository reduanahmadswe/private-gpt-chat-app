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
    <div className="min-h-screen bg-gradient-to-br from-[#030637] to-[#3C0753] text-white">
      {/* Header */}
      <header className="bg-[#3C0753]/80 backdrop-blur-md border-b border-[#720455] sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-[#910A67] rounded-full p-2">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-[#910A67]">AI</span> Bondhu
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-gray-300 hover:text-white transition-colors"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Contact
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/auth/signin"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/auth/signup"
                className="bg-[#910A67] hover:bg-[#720455] text-white px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="bg-[#720455]/30 backdrop-blur-sm rounded-full p-6">
              <Brain className="h-20 w-20 text-[#910A67]" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Private GPT Chat
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-12 animate-slide-up">
            Experience AI-powered conversations with complete privacy and
            security. Your chats, your data, your control.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link
              to="/auth/signup"
              className="bg-[#910A67] hover:bg-[#720455] text-white text-lg px-8 py-4 rounded-2xl transition-colors inline-flex items-center justify-center"
            >
              Get Started Free
            </Link>
            <Link
              to="/auth/signin"
              className="border border-[#720455] hover:bg-[#720455]/20 text-white text-lg px-8 py-4 rounded-2xl transition-colors inline-flex items-center justify-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose AI Bondhu?
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Discover the features that make our AI chat platform the best choice
            for your conversations
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#720455]/20 backdrop-blur-sm border border-[#720455]/30 rounded-2xl p-8 text-center animate-slide-up">
            <div className="flex justify-center mb-6">
              <div className="bg-[#910A67]/20 rounded-full p-4">
                <MessageCircle className="h-12 w-12 text-[#910A67]" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Smart Conversations
            </h3>
            <p className="text-white/70">
              Powered by advanced AI, engage in natural, intelligent
              conversations that understand context and provide helpful
              responses.
            </p>
          </div>

          <div className="bg-[#720455]/20 backdrop-blur-sm border border-[#720455]/30 rounded-2xl p-8 text-center animate-slide-up">
            <div className="flex justify-center mb-6">
              <div className="bg-[#910A67]/20 rounded-full p-4">
                <Shield className="h-12 w-12 text-[#910A67]" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Complete Privacy
            </h3>
            <p className="text-white/70">
              Your conversations are encrypted and stored securely. Only you
              have access to your chat history and data.
            </p>
          </div>

          <div className="bg-[#720455]/20 backdrop-blur-sm border border-[#720455]/30 rounded-2xl p-8 text-center animate-slide-up">
            <div className="flex justify-center mb-6">
              <div className="bg-[#910A67]/20 rounded-full p-4">
                <Zap className="h-12 w-12 text-[#910A67]" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Lightning Fast
            </h3>
            <p className="text-white/70">
              Get instant responses with our optimized infrastructure. No
              waiting, just seamless conversations.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div id="about" className="container mx-auto px-4 py-20 text-center">
        <div className="bg-[#720455]/20 backdrop-blur-sm border border-[#720455]/30 rounded-2xl p-12 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Private AI Journey?
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust AI Bondhu for their AI
            conversations. Experience the future of private, secure AI chat
            today.
          </p>
          <Link
            to="/auth/signup"
            className="bg-[#910A67] hover:bg-[#720455] text-white text-lg px-8 py-4 rounded-2xl transition-colors inline-flex items-center justify-center"
          >
            Create Your Account
          </Link>
        </div>
      </div>

      {/* Contact with Owner Section */}
      <section id="contact" className="py-20 bg-[#3C0753]/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Contact with Owner</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Connect with the creator of AI Bondhu. Let's discuss
              opportunities, collaborations, or just say hello!
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-[#720455]/20 backdrop-blur-sm border border-[#720455]/30 rounded-3xl p-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-[#910A67] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Brain className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Reduan Ahmad</h3>
                <p className="text-white/70">
                  Full Stack Developer & AI Enthusiast
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* GitHub */}
                <a
                  href="https://github.com/reduanahmadswe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#3C0753]/50 hover:bg-[#720455]/30 border border-[#720455]/50 rounded-2xl p-6 transition-all duration-300 hover:scale-105 group"
                >
                  <div className="flex flex-col items-center text-center">
                    <Github className="h-8 w-8 text-white/80 group-hover:text-white mb-3" />
                    <h4 className="font-semibold mb-2">GitHub</h4>
                    <p className="text-sm text-white/60 group-hover:text-white/80">
                      View Projects
                    </p>
                    <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-white/60 mt-2" />
                  </div>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/reduanahmadswe/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#3C0753]/50 hover:bg-[#720455]/30 border border-[#720455]/50 rounded-2xl p-6 transition-all duration-300 hover:scale-105 group"
                >
                  <div className="flex flex-col items-center text-center">
                    <Linkedin className="h-8 w-8 text-white/80 group-hover:text-white mb-3" />
                    <h4 className="font-semibold mb-2">LinkedIn</h4>
                    <p className="text-sm text-white/60 group-hover:text-white/80">
                      Professional Network
                    </p>
                    <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-white/60 mt-2" />
                  </div>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/reduanahmadswe/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#3C0753]/50 hover:bg-[#720455]/30 border border-[#720455]/50 rounded-2xl p-6 transition-all duration-300 hover:scale-105 group"
                >
                  <div className="flex flex-col items-center text-center">
                    <Facebook className="h-8 w-8 text-white/80 group-hover:text-white mb-3" />
                    <h4 className="font-semibold mb-2">Facebook</h4>
                    <p className="text-sm text-white/60 group-hover:text-white/80">
                      Social Connect
                    </p>
                    <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-white/60 mt-2" />
                  </div>
                </a>

                {/* Portfolio */}
                <a
                  href="https://reduanahmadswe-kappa.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#3C0753]/50 hover:bg-[#720455]/30 border border-[#720455]/50 rounded-2xl p-6 transition-all duration-300 hover:scale-105 group"
                >
                  <div className="flex flex-col items-center text-center">
                    <Brain className="h-8 w-8 text-white/80 group-hover:text-white mb-3" />
                    <h4 className="font-semibold mb-2">Portfolio</h4>
                    <p className="text-sm text-white/60 group-hover:text-white/80">
                      My Work & Skills
                    </p>
                    <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-white/60 mt-2" />
                  </div>
                </a>
              </div>

              <div className="mt-8 text-center">
                <p className="text-white/70 mb-4">
                  Open to exciting opportunities and collaborations
                </p>
                <div className="flex justify-center space-x-4">
                  <span className="bg-[#910A67]/20 text-[#910A67] px-3 py-1 rounded-full text-sm">
                    Full Stack Development
                  </span>
                  <span className="bg-[#910A67]/20 text-[#910A67] px-3 py-1 rounded-full text-sm">
                    AI Integration
                  </span>
                  <span className="bg-[#910A67]/20 text-[#910A67] px-3 py-1 rounded-full text-sm">
                    React & Node.js
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#030637]/80 backdrop-blur-md border-t border-[#720455] mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-[#910A67] rounded-full p-2">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">
                  <span className="text-[#910A67]">AI</span> Bondhu
                </span>
              </div>
              <p className="text-white/70 mb-4 max-w-md">
                Your trusted companion for private AI conversations. Secure,
                intelligent, and always available.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-white/60 hover:text-[#910A67] transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-white/60 hover:text-[#910A67] transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="mailto:support@aibondhu.com"
                  className="text-white/60 hover:text-[#910A67] transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <Link
                    to="/auth/signup"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    to="/auth/signin"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#contact"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[#720455]/30 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm mb-4 md:mb-0">
              © 2025 AI Bondhu. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-white/60 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-[#910A67]" />
              <span>for secure conversations</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
