import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import Summary from "../components/Description";

function App() {
  return (
    <div className="font-sans bg-almond-500">
      <Header />
      <Hero />
      <Summary/>
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}

export default App;
