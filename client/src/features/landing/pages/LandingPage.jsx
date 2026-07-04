import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import TrustedBy from '../components/TrustedBy.jsx';
import ProductDemo from '../components/ProductDemo.jsx';
import Features from '../components/Features.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import Security from '../components/Security.jsx';
import ComparisonSection from '../components/ComparisonSection.jsx';
import Stats from '../components/Stats.jsx';
import Testimonials from '../components/Testimonials.jsx';
import FAQ from '../components/FAQ.jsx';
import CTA from '../components/CTA.jsx';
import Footer from '../components/Footer.jsx';

/**
 * Root marketing landing page.
 * Aggregates all structural landing panels in design system order.
 */
const LandingPage = () => {
  return (
    <div className="w-full bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <Hero />
      <TrustedBy />
      <ProductDemo />
      <Features />
      <HowItWorks />
      <Security />
      <ComparisonSection />
      <Stats />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
