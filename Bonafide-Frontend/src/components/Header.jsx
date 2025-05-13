import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Header = () => (
  <header className="bg-white shadow-lg rounded-b-2xl ring-1 ring-gray-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        {/* Wrap the logo in a Link component to redirect to homepage */}
        <Link to="/">
          <img
            className="h-12 w-auto"
            src="./public/bonafide-logo.png"
            alt="Bonafide Logo"
          />
        </Link>
      </div>
      <nav className="flex space-x-6 items-center">
        <a
          href="/validate"
          className="bg-indigo-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-indigo-700 hover:scale-105 transition-transform duration-300"
        >
          Upload
        </a>
        <a
          href="/data"
          className="bg-indigo-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-indigo-700 hover:scale-105 transition-transform duration-300"
        >
          Your Data
        </a>
        <a
          href="/contact"
          className="bg-indigo-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-indigo-700 hover:scale-105 transition-transform duration-300"
        >
          Contact
        </a>
      </nav>
    </div>
  </header>
);

export default Header;
