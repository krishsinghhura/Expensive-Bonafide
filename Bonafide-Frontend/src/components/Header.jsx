import React from 'react';

const Header = () => (
  <header className="bg-white shadow-md">
    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-indigo-600">CredSure</h1>
      <nav className="space-x-6">
        <a href="#features" className="text-gray-700 hover:text-indigo-600">Features</a>
        <a href="#pricing" className="text-gray-700 hover:text-indigo-600">Pricing</a>
        <a href="#contact" className="text-gray-700 hover:text-indigo-600">Contact</a>
      </nav>
    </div>
  </header>
);

export default Header;
