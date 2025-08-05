import { Brain, ExternalLink, Facebook, Github, Linkedin } from "lucide-react";
import React from "react";

const Contact: React.FC = () => {
  return (
    <section
      id="contact"
      className="w-full flex-1 flex items-center justify-center px-4 sm:px-6"
    >
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] bg-clip-text text-transparent">
              Contact with Owner
            </span>
          </h2>
          <p className="text-[#E0E0E0] text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light px-4">
            Connect with the creator of AI Bondhu. Let's discuss opportunities,
            collaborations, or just say hello!
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
                  <h4 className="font-bold text-white mb-2 text-lg">GitHub</h4>
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
  );
};

export default Contact;
