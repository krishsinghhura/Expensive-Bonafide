import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import bonafideLogo from "./bonafide-logo.png"

const Header = () => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [studentAuthenticated, setStudentAuthenticated] = useState(false);
  const [univAuthenticated, setUnivAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const studentToken = Cookies.get("StudentToken");
      if (studentToken) {
        setStudentAuthenticated(true);
      }
      const univToken = Cookies.get("token");
      if (univToken) {
        setUnivAuthenticated(true);
      }
    };

    checkAuth();
  }, []);

  const activeStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transform: "scale(1.05)",
  };

  const handleLogout = () => {
    Cookies.remove("StudentToken");
    Cookies.remove("token");
    localStorage.removeItem("token");
    setStudentAuthenticated(false);
    setUnivAuthenticated(false); // <-- Fix: Update auth state
    setShowLogoutConfirm(false); // Close modal
    navigate("/auth");
  };

  return (
    <>
      <header className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <img
                className="h-10 w-auto transition-transform group-hover:scale-110"
                src={bonafideLogo}
                alt="Bonafide Logo"
              />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {univAuthenticated && (
              <>
                <NavLink
                  to="/validate"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium text-black hover:bg-blue-500/50 transition-all duration-300 flex items-center ${
                      isActive ? "bg-blue-500/30" : ""
                    }`
                  }
                  style={({ isActive }) => (isActive ? activeStyle : {})}
                >
                  <span className="hidden sm:inline">Upload</span>
                  <span className="sm:hidden">⬆️</span>
                </NavLink>
              </>
            )}

            {(studentAuthenticated || univAuthenticated) &&
              (studentAuthenticated ? (
                <>
                  <NavLink
                    to="/student-dashboard"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg text-sm font-medium text-black hover:bg-blue-500/50 transition-all duration-300 flex items-center ${
                        isActive ? "bg-blue-500/30" : ""
                      }`
                    }
                    style={({ isActive }) => (isActive ? activeStyle : {})}
                  >
                    <span className="hidden sm:inline">Your Data</span>
                    <span className="sm:hidden">📄</span>
                  </NavLink>
                </>
              ) : (
                <NavLink
                  to="/data"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium text-black hover:bg-blue-500/50 transition-all duration-300 flex items-center ${
                      isActive ? "bg-blue-500/30" : ""
                    }`
                  }
                  style={({ isActive }) => (isActive ? activeStyle : {})}
                >
                  <span className="hidden sm:inline">Your Data</span>
                  <span className="sm:hidden">📄</span>
                </NavLink>
              ))}

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium text-black hover:bg-blue-500/50 transition-all duration-300 flex items-center ${
                  isActive ? "bg-blue-500/30" : ""
                }`
              }
              style={({ isActive }) => (isActive ? activeStyle : {})}
            >
              <span className="hidden sm:inline">Contact</span>
              <span className="sm:hidden">✉️</span>
            </NavLink>

            <NavLink
              to="/verify-by-third-party"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium text-black hover:bg-blue-500/50 transition-all duration-300 flex items-center ${
                  isActive ? "bg-blue-500/30" : ""
                }`
              }
              style={({ isActive }) => (isActive ? activeStyle : {})}
            >
              <span className="hidden sm:inline">Verify</span>
              <span className="sm:hidden">✅</span>
            </NavLink>

            {(studentAuthenticated || univAuthenticated) && (
              <>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="ml-2 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            )}
            
            {
              (studentAuthenticated || univAuthenticated) && (
                <>
                <NavLink
                  to="/profile"
                  className="p-2 rounded-full hover:bg-blue-500/50 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-500/30 flex items-center justify-center text-black font-medium">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </NavLink>
                </>
              )
            }


          </div>
        </div>
      </header>

      {/* 🔒 Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md text-center"
            >
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Confirm Logout
              </h2>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Are you sure you want to log out?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium transition-all"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
