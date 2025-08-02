import React from "react";
import CallToAction from "../components/landing/CallToAction";
import Contact from "../components/landing/Contact";
import Features from "../components/landing/Features";
import Footer from "../components/landing/Footer";
import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#030637] text-white font-sans">
      <Header />
      <Hero />
      <Features />
      <CallToAction />
      <Contact />
      <Footer />
    </div>
  );
};
export default LandingPage;
