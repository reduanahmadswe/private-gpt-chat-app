import { ExternalLink, Github, Mail, MapPin, User } from "lucide-react";
import React from "react";

interface DeveloperInfoProps {
  className?: string;
}

const DeveloperInfo: React.FC<DeveloperInfoProps> = ({ className = "" }) => {
  return (
    <div
      className={`bg-gradient-to-br from-slate-800/95 to-slate-700/95 backdrop-blur-xl rounded-xl border border-slate-600/50 p-6 shadow-2xl ${className}`}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full p-3 border border-blue-400/30">
          <User className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">
            Developer Information
          </h3>
          <p className="text-slate-300 text-sm">
            About the creator of AI Bondhu
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Developer Name */}
        <div className="flex items-center space-x-3">
          <User className="h-5 w-5 text-blue-400 flex-shrink-0" />
          <div>
            <p className="text-white font-semibold">Reduan Ahmad</p>
            <p className="text-slate-400 text-sm">
              Full-Stack Developer & AI Enthusiast
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-green-400 flex-shrink-0" />
          <div>
            <p className="text-white">Bangladesh 🇧🇩</p>
            <p className="text-slate-400 text-sm">Based in Dhaka</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center space-x-3">
          <Mail className="h-5 w-5 text-orange-400 flex-shrink-0" />
          <div className="flex-1">
            <a
              href="mailto:reduanahmadswe@gmail.com"
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1 group"
            >
              <span>reduanahmadswe@gmail.com</span>
              <ExternalLink className="h-3 w-3 group-hover:scale-110 transition-transform" />
            </a>
            <p className="text-slate-400 text-sm">Contact for collaboration</p>
          </div>
        </div>

        {/* GitHub */}
        <div className="flex items-center space-x-3">
          <Github className="h-5 w-5 text-purple-400 flex-shrink-0" />
          <div className="flex-1">
            <a
              href="https://github.com/reduanahmadswe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1 group"
            >
              <span>github.com/reduanahmadswe</span>
              <ExternalLink className="h-3 w-3 group-hover:scale-110 transition-transform" />
            </a>
            <p className="text-slate-400 text-sm">
              Open source projects & contributions
            </p>
          </div>
        </div>

        {/* LinkedIn */}
        <div className="flex items-center space-x-3">
          <div className="h-5 w-5 text-blue-500 flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>
          <div className="flex-1">
            <a
              href="https://linkedin.com/in/reduanahmadswe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1 group"
            >
              <span>linkedin.com/in/reduanahmadswe</span>
              <ExternalLink className="h-3 w-3 group-hover:scale-110 transition-transform" />
            </a>
            <p className="text-slate-400 text-sm">Professional network</p>
          </div>
        </div>

        {/* Facebook */}
        <div className="flex items-center space-x-3">
          <div className="h-5 w-5 text-blue-600 flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
          <div className="flex-1">
            <a
              href="https://facebook.com/reduanahmadswe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1 group"
            >
              <span>facebook.com/reduanahmadswe</span>
              <ExternalLink className="h-3 w-3 group-hover:scale-110 transition-transform" />
            </a>
            <p className="text-slate-400 text-sm">Social connection</p>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h4 className="text-white font-semibold mb-3">Technical Expertise</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              "React & TypeScript",
              "Node.js & Express",
              "Python & AI/ML",
              "MongoDB & PostgreSQL",
              "React Native",
              "Capacitor",
              "OpenAI APIs",
              "Tailwind CSS",
            ].map((skill, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-lg px-3 py-2 border border-slate-500/30"
              >
                <span className="text-slate-200 text-sm">{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* App Info */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
          <h4 className="text-white font-semibold mb-2">About This App</h4>
          <p className="text-slate-300 text-sm leading-relaxed">
            "Private GPT Chat" is a secure, privacy-focused AI chat application
            featuring real-time conversations, voice integration, OAuth
            authentication, and mobile-responsive design. Built with modern
            technologies to provide users with a private way to interact with AI
            models.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeveloperInfo;
