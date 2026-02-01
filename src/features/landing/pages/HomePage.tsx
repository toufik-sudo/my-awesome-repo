import React from 'react';
import {
  Navbar,
  HeroSection,
  ServicesSection,
  FeaturesSection,
  PricingSection,
  ContactSection,
  FooterSection,
} from '../components';

/**
 * Home page with all landing sections
 */
const HomePage: React.FC = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <FeaturesSection />
        <PricingSection />
        <ContactSection />
      </main>
      <FooterSection />
    </>
  );
};

export default HomePage;
