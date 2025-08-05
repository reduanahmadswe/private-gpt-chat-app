import { Brain, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      // Get the landing page container for proper scrolling
      const landingPage = document.querySelector(".landing-page");
      if (landingPage) {
        // Calculate position relative to the scrollable container
        const targetRect = target.getBoundingClientRect();
        const containerRect = landingPage.getBoundingClientRect();
        const scrollTop = landingPage.scrollTop;
        const targetPosition = targetRect.top - containerRect.top + scrollTop;

        landingPage.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      } else {
        // Fallback to window scroll
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
    closeMobileMenu();
  };

  return (
    <header className="bg-[#030637]/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl shadow-black/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="bg-gradient-to-br from-[#00f5ff] to-[#9d4edd] rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-lg shadow-[#00f5ff]/20">
              <Brain className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] bg-clip-text text-transparent">
                AI
              </span>
              <span className="text-white ml-1">Bondhu</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <a
              href="#features"
              onClick={(e) => handleSmoothScroll(e, "features")}
              className="text-[#E0E0E0] hover:text-white hover:bg-white/10 px-3 lg:px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm lg:text-base cursor-pointer"
            >
              Features
            </a>
            <a
              href="#about"
              onClick={(e) => handleSmoothScroll(e, "about")}
              className="text-[#E0E0E0] hover:text-white hover:bg-white/10 px-3 lg:px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm lg:text-base cursor-pointer"
            >
              About
            </a>
            <a
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, "contact")}
              className="text-[#E0E0E0] hover:text-white hover:bg-white/10 px-3 lg:px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm lg:text-base cursor-pointer"
            >
              Contact
            </a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <Link
              to="/auth/signin"
              className="text-[#E0E0E0] hover:text-white hover:bg-white/10 px-4 lg:px-5 py-2 lg:py-2.5 rounded-xl transition-all duration-300 font-medium text-sm lg:text-base"
            >
              Sign In
            </Link>
            <Link
              to="/auth/signup"
              className="bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] hover:from-[#9d4edd] hover:to-[#00f5ff] text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-[#00f5ff]/25 hover:shadow-xl hover:shadow-[#9d4edd]/30 transform hover:scale-105 font-semibold text-sm lg:text-base"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-300 mobile-touch-target"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4">
            <nav className="flex flex-col space-y-2">
              <a
                href="#features"
                onClick={(e) => handleSmoothScroll(e, "features")}
                className="text-[#E0E0E0] hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-all duration-300 font-medium mobile-touch-target cursor-pointer"
              >
                Features
              </a>
              <a
                href="#about"
                onClick={(e) => handleSmoothScroll(e, "about")}
                className="text-[#E0E0E0] hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-all duration-300 font-medium mobile-touch-target cursor-pointer"
              >
                About
              </a>
              <a
                href="#contact"
                onClick={(e) => handleSmoothScroll(e, "contact")}
                className="text-[#E0E0E0] hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-all duration-300 font-medium mobile-touch-target cursor-pointer"
              >
                Contact
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                <Link
                  to="/auth/signin"
                  onClick={closeMobileMenu}
                  className="text-[#E0E0E0] hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-center mobile-touch-target"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/signup"
                  onClick={closeMobileMenu}
                  className="bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] hover:from-[#9d4edd] hover:to-[#00f5ff] text-white px-4 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-[#00f5ff]/25 hover:shadow-xl hover:shadow-[#9d4edd]/30 font-semibold text-center mobile-touch-target"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
