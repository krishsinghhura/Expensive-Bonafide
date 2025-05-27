import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUniversity, FaUserGraduate, FaLock, FaEnvelope, FaUser, FaKey } from "react-icons/fa";

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [userType, setUserType] = useState("university");
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    privateKey: "",
  });

  const navigate = useNavigate();

  // Check for existing tokens and redirect if found
  useEffect(() => {
    const universityToken = localStorage.getItem("token");
    if (universityToken) {
      navigate("/data");
    }
  }, [navigate]);

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    setFormErrors({});
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      privateKey: "",
    });
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setFormErrors({});
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      privateKey: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    if (!isSignIn) {
      if (userType === "university" && !formData.name) {
        errors.name = "Institution name is required";
      }
      
      if (userType === "university" && !formData.privateKey) {
        errors.privateKey = "Private key is required";
      }
      
      if (userType === "student" && formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) return;
    
    setIsLoading(true);
    
    const apiBase = "https://expensive-bonafide-production.up.railway.app/api";
    
    try {
      if (isSignIn) {
        // Login logic
        const response = await axios.post(`${apiBase}/${userType}/login`, {
          email: formData.email,
          password: formData.password,
        });
        
        // Set cookie with secure flags
        const cookieOptions = {
          expires: 7, // days
          secure: true,
          sameSite: 'strict'
        };
        
        localStorage.setItem("token", response.data.token);
          navigate("/data");
      } else {
        // Register logic
        const payload = userType === "student" ? {
          email: formData.email,
          password: formData.password,
        } : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          privateKey: formData.privateKey,
        };
        
        const response = await axios.post(`${apiBase}/${userType}/register`, payload);
        
        const cookieOptions = {
          expires: 7,
          secure: true,
          sameSite: 'strict'
        };
        
        localStorage.setItem("token", response.data.token);
          navigate("/data");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert(error.response?.data?.message || 
           (isSignIn ? "Login failed. Please check your credentials." : "Registration failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            {isSignIn ? "Welcome Back" : "Create Your Account"}
          </h1>
          <p className="text-blue-600">
            {isSignIn 
              ? "Sign in to access your dashboard" 
              : "Join us to start your digital credential journey"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
          {/* User Type Selector */}
          <div className="flex border-b border-blue-100">
            <button
              onClick={() => handleUserTypeChange("university")}
              className={`flex-1 py-3 flex items-center justify-center space-x-2 transition-colors ${
                userType === "university" 
                  ? "bg-blue-600 text-white" 
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              <FaUniversity />
              <span>University</span>
            </button>
            <button
              onClick={() => handleUserTypeChange("student")}
              className={`flex-1 py-3 flex items-center justify-center space-x-2 transition-colors ${
                userType === "student" 
                  ? "bg-blue-600 text-white" 
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              <FaUserGraduate />
              <span>Student</span>
            </button>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              {isSignIn ? "Sign In" : "Sign Up"} as {userType === "university" ? "Institution" : "Student"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isSignIn && userType === "university" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`pl-10 w-full px-4 py-2 border ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="University name"
                    />
                  </div>
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 w-full px-4 py-2 border ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="your@email.com"
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 w-full px-4 py-2 border ${
                      formErrors.password ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="••••••••"
                  />
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                )}
              </div>

              {!isSignIn && userType === "student" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`pl-10 w-full px-4 py-2 border ${
                        formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="••••••••"
                    />
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                  )}
                </div>
              )}

              {!isSignIn && userType === "university" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Private Key
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaKey className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="privateKey"
                      value={formData.privateKey}
                      onChange={handleChange}
                      className={`pl-10 w-full px-4 py-2 border ${
                        formErrors.privateKey ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter your private key"
                    />
                  </div>
                  {formErrors.privateKey && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.privateKey}</p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  isSignIn ? "Sign In" : "Create Account"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={toggleForm}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {isSignIn 
                  ? "Don't have an account? Sign Up" 
                  : "Already have an account? Sign In"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}