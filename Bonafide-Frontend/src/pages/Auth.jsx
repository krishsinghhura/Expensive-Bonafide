import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [userType, setUserType] = useState("university"); // "student" or "university"

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    privateKey: "",
  });

  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
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
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      privateKey: "",
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const apiBase = "http://localhost:4000/api";

  try {
    if (isSignIn) {
      // Login logic
      const loginEndpoint = `${apiBase}/${userType}/login`;
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(loginEndpoint, payload);

      // Set cookie based on userType
      if (userType === "student") {
        Cookies.set("StudentToken", response.data.token);
        alert("Login successful");
        navigate("/student-dashboard", { state: response.data });
      } else {
        Cookies.set("token", response.data.token);
        alert("Login successful");
        navigate("/");
      }

    } else {
      // Register logic
      const registerEndpoint = `${apiBase}/${userType}/register`;

      if (userType === "student") {
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match");
          return;
        }
        const payload = {
          email: formData.email,
          password: formData.password,
        };
        const response = await axios.post(registerEndpoint, payload);
        Cookies.set("StudentToken", response.data.token);
        alert("Registered Successfully");
        navigate("/student-dashboard", { state: response.data });
      } else {
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          privateKey: formData.privateKey,
        };
        const response = await axios.post(registerEndpoint, payload);
        Cookies.set("token", response.data.token);
        alert("Registered Successfully");
        navigate("/");
      }
    }
  } catch (error) {
    alert(isSignIn ? "Login failed" : "Registration failed");
    console.error(error);
  }
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-opacity-30 backdrop-blur-xl">
      <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-lg animate-fade-in">
        Get started with Us
      </h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => handleUserTypeChange("university")}
          className={`px-6 py-2 rounded-md font-semibold ${
            userType === "university"
              ? "bg-white text-purple-700 shadow-lg"
              : "bg-purple-600 text-white"
          }`}
        >
          University
        </button>
        <button
          onClick={() => handleUserTypeChange("student")}
          className={`px-6 py-2 rounded-md font-semibold ${
            userType === "student"
              ? "bg-white text-purple-700 shadow-lg"
              : "bg-purple-600 text-white"
          }`}
        >
          Student
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-200 transition-transform duration-500 hover:scale-105">
        <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
          {isSignIn ? "Sign In" : "Sign Up"} as {userType}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* For University Signup */}
          {!isSignIn && userType === "university" && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Enter your name"
                />
              </div>
            </>
          )}

          {/* Common Email Input */}
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your email"
            />
          </div>

          {/* Common Password Input */}
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your password"
            />
          </div>

          {/* Confirm Password for Student Signup */}
          {!isSignIn && userType === "student" && (
            <div className="mb-4">
              <label className="block text-gray-700">Retype Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Retype your password"
              />
            </div>
          )}

          {/* Private Key for University Signup */}
          {!isSignIn && userType === "university" && (
            <div className="mb-6">
              <label className="block text-gray-700">Private Key</label>
              <input
                type="text"
                name="privateKey"
                value={formData.privateKey}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Enter your private key"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-300"
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleForm}
            className="text-purple-700 font-medium hover:underline"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
