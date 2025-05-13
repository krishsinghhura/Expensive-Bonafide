import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import axios from "axios"

export default function UniversitySignIn() {
  const [formData, setFormData] = useState({ name: "", password: "", privateKey: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    console.log("Submitting form data:", formData);

    const response = await axios.post("http://localhost:4000/api/university/register", formData);
    console.log("Response status:", response.status);

    if (response.status === 201) {
      alert("Success")

      // Optional: store user info if needed later
      localStorage.setItem("user", JSON.stringify({ name: formData.name, role: "university" }));

      // Navigate after short delay
      setTimeout(() => navigate("/"), 1500);
    }
  } catch (error) {
    console.error("Error during registration:", error); // helpful for debugging
    alert("Registration failed. Please check your details and try again.");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">University Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">University Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Private Key</label>
            <input
              type="text"
              name="privateKey"
              value={formData.privateKey}
              onChange={handleChange}
              className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <Button type="submit" className="w-full mt-4">Sign In</Button>
        </form>
      </div>
    </div>
  );
}