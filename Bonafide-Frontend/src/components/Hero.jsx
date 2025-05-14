import React from 'react';

const Hero = () => (
  <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-28 md:py-36">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <h2 className="text-6xl md:text-7xl font-extrabold mb-6 animate-fade-in">
        Secure Digital Credentials
      </h2>
      <p className="text-xl md:text-2xl mb-8 animate-fade-in delay-200">
        Empower your organization with verifiable blockchain credentials.
      </p>
      <a
        href="/auth"
        className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-transform duration-300"
      >
        Get Started
      </a>
    </div>
  </section>
);

export default Hero;
