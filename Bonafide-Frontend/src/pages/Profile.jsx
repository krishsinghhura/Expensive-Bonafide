import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { FaEdit, FaUnlockAlt, FaCheckCircle, FaDownload } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", role: "Student" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "https://bonafide-backend.onrender.com/get-data/details",
          {
            withCredentials: true,
          }
        );

        const data = response.data.university || response.data.Student;


        setUser({
          name: data.name,
          email: data.email,
          role:
            data.role || (response.data.university ? "University" : "Student"),
          lastLogin: Cookies.get("lastLogin") || new Date().toLocaleString(),
          twoFA: data.twoFA || false,
        });
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/auth");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white transition-all duration-300">
      {/* Floating Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-2xl">
        <Header />
      </div>

      {/* Content Area */}
      <div className="flex-1 pt-[111px] pb-16 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto bg-blue-300/30 backdrop-blur-md border border-blue-200/40 shadow-2xl rounded-2xl p-8 sm:p-12 text-blue-900 transition-transform duration-500 hover:scale-[1.01]">
          <h2 className="text-4xl font-bold mb-8 text-center">Your Profile</h2>

          <div className="flex flex-col sm:flex-row items-center gap-10 mb-10">
            <div className="flex-shrink-0">
              <img
                src="https://via.placeholder.com/150"
                alt="Profile"
                className="rounded-full w-36 h-36 border-4 border-blue-200 shadow-md transition-transform duration-300 hover:scale-105"
              />
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div>
                <label className="block text-sm font-medium text-blue-700">
                  Full Name
                </label>
                <p className="bg-white/30 rounded-lg p-3 text-lg font-semibold shadow-inner">
                  {user.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700">
                  Email Address
                </label>
                <p className="bg-white/30 rounded-lg p-3 text-lg font-semibold shadow-inner">
                  {user.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700">
                  Role
                </label>
                <p className="bg-white/30 rounded-lg p-3 text-lg font-semibold shadow-inner">
                  {user.role}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <div className="bg-white/40 text-blue-800 px-4 py-2 rounded-xl shadow text-sm flex items-center gap-2">
                  <FaCheckCircle className="text-green-600" /> Last Login:{" "}
                  {user.lastLogin}
                </div>
                <div className="bg-white/40 text-blue-800 px-4 py-2 rounded-xl shadow text-sm flex items-center gap-2">
                  <FaUnlockAlt className="text-yellow-600" />
                  2FA: {user.twoFA ? "Enabled" : "Disabled"}
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <button className="flex items-center justify-center gap-2 bg-white/40 hover:bg-white/60 text-blue-800 px-5 py-3 rounded-xl shadow transition">
              <FaEdit /> Edit Profile
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/40 hover:bg-white/60 text-blue-800 px-5 py-3 rounded-xl shadow transition">
              <FaUnlockAlt /> Change Password
            </button>
            <button
              className="flex items-center justify-center gap-2 bg-white/40 hover:bg-white/60 text-blue-800 px-5 py-3 rounded-xl shadow transition"
              onClick={() => navigate("/verify-student")}
            >
              <FaCheckCircle /> Verify Achievements
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/40 hover:bg-white/60 text-blue-800 px-5 py-3 rounded-xl shadow transition">
              <FaDownload /> Download My Data
            </button>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2 rounded-xl bg-white/50 hover:bg-white text-blue-800 font-medium shadow-md transition duration-300"
            >
              Back to Home
            </button>

            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-medium shadow-md transition duration-300"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="mt-auto w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
