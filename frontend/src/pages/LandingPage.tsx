import React from "react";
import CallToAction from "../components/landing/CallToAction";
import Contact from "../components/landing/Contact";
import Features from "../components/landing/Features";
import Footer from "../components/landing/Footer";
import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page min-h-[100dvh] w-full bg-[#030637] text-white font-sans overflow-x-hidden">
      <Header />
      <section
        id="home"
        className="min-h-[100dvh] flex items-center px-4 sm:px-6 lg:px-8 py-16 sm:py-0"
      >
        <Hero />
      </section>
      <section
        id="features"
        className="min-h-[100dvh] flex items-center px-4 sm:px-6 lg:px-8 py-16 sm:py-0"
      >
        <Features />
      </section>
      <section
        id="about"
        className="min-h-[100dvh] flex items-center px-4 sm:px-6 lg:px-8 py-16 sm:py-0"
      >
        <CallToAction />
      </section>
      <section
        id="contact"
        className="min-h-[100dvh] flex items-center px-4 sm:px-6 lg:px-8 py-16 sm:py-0"
      >
        <Contact />
      </section>
      <Footer />
    </div>
  );
};
export default LandingPage;
