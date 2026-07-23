import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import WorkflowTimeline from '../components/WorkflowTimeline.jsx';
import Features from '../components/Features.jsx';
import ProductShowcase from '../components/ProductShowcase.jsx';
import WhyUs from '../components/WhyUs.jsx';
import TechGrid from '../components/TechGrid.jsx';
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
      <WorkflowTimeline />
      <Features />
      <ProductShowcase />
      <WhyUs />
      <TechGrid />
      <Footer />
    </div>
  );
};

export default LandingPage;
