import React from 'react';

const Header = () => (
  <header className="bg-white shadow-md">
    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-indigo-600">Bonafide</h1>
      <nav className="space-x-6">
        <a href="/validate" className="text-gray-700 hover:text-indigo-600">Upload</a>
        <a href="/data" className="text-gray-700 hover:text-indigo-600">Your Data</a>
        <a href="/contact" className="text-gray-700 hover:text-indigo-600">Contact</a>
      </nav>
    </div>
  </header>
);

export default Header;
