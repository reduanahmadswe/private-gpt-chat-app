import React from "react";
import CallToAction from "../components/landing/CallToAction";
import Contact from "../components/landing/Contact";
import Features from "../components/landing/Features";
import Footer from "../components/landing/Footer";
import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page min-h-screen bg-[#030637] text-white font-sans">
      <Header />
      <section
        id="home"
        className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8"
      >
        <Hero />
      </section>
      <section
        id="features"
        className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8"
      >
        <Features />
      </section>
      <section
        id="about"
        className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8"
      >
        <CallToAction />
      </section>
      <section
        id="contact"
        className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8"
      >
        <Contact />
      </section>
      <Footer />
    </div>
  );
};
export default LandingPage;
