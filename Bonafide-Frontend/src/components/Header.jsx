import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

const Header = () => {
  // Active link style
  const navigate=useNavigate();
  const activeStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.05)'
  };

   const handleLogout = () => {
    // Clear all auth-related cookies (customize based on your auth keys)
    Cookies.remove('token'); // Add/remove keys based on your usage

    // Redirect to /auth
    navigate('/auth');
  };

  return (
    <header className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <img
              className="h-10 w-auto transition-transform group-hover:scale-110"
              src="./public/bonafide-logo.png"
              alt="Bonafide Logo"
            />
          </Link>
        </div>

        <nav className="flex space-x-2 sm:space-x-4 items-center">
          <NavLink
            to="/validate"
            className={({ isActive }) => 
              `px-4 py-2 rounded-lg text-sm font-medium text-black hover:bg-blue-500/50 transition-all duration-300 flex items-center
              ${isActive ? 'bg-blue-500/30' : ''}`
            }
            style={({ isActive }) => isActive ? activeStyle : {}}
          >
            <span className="hidden sm:inline">Upload</span>
            <span className="sm:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </NavLink>

          <NavLink
            to="/data"
            className={({ isActive }) => 
              `px-4 py-2 rounded-lg text-sm font-medium text-black hover:bg-blue-500/50 transition-all duration-300 flex items-center
              ${isActive ? 'bg-blue-500/30' : ''}`
            }
            style={({ isActive }) => isActive ? activeStyle : {}}
          >
            <span className="hidden sm:inline">Your Data</span>
            <span className="sm:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </span>
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) => 
              `px-4 py-2 rounded-lg text-sm font-medium text-black hover:bg-blue-500/50 transition-all duration-300 flex items-center
              ${isActive ? 'bg-blue-500/30' : ''}`
            }
            style={({ isActive }) => isActive ? activeStyle : {}}
          >
            <span className="hidden sm:inline">Contact</span>
            <span className="sm:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </span>
          </NavLink>

          <NavLink
            to="/verify-student"
            className={({ isActive }) => 
              `px-4 py-2 rounded-lg text-sm font-medium text-black hover:bg-blue-500/50 transition-all duration-300 flex items-center
              ${isActive ? 'bg-blue-500/30' : ''}`
            }
            style={({ isActive }) => isActive ? activeStyle : {}}
          >
            <span className="hidden sm:inline">Verify</span>
            <span className="sm:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          </NavLink>

          <div className="hidden md:block h-6 w-px bg-blue-400/50 mx-1"></div>

          <NavLink
            to="/profile"
            className="p-2 rounded-full hover:bg-blue-500/50 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-blue-500/30 flex items-center justify-center text-black font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </NavLink>
           {/* 🔴 Logout Button */}
          <button
            onClick={handleLogout}
            className="ml-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-500/20 transition-all duration-300 border border-red-500"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;