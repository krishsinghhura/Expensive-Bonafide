import React from 'react';

const Footer = () => (
  <footer className="bg-gray-500 text-white py-8">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <p>&copy; {new Date().getFullYear()} CampustoCrypto. All rights reserved.</p>
      <div className="mt-4 space-x-4">
        <a href="#privacy" className="text-gray-400 hover:text-white">Privacy Policy</a>
        <a href="#terms" className="text-gray-400 hover:text-white">Terms of Service</a>
      </div>
    </div>
  </footer>
);

export default Footer;
