import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [name, setName] = useState(null);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchStudent = async (req, res) => {
      const token=localStorage.getItem("token");
      try {
        const response = await axios.get(
          "https://bonafide-backend.onrender.com/get-data/details",
          {
            headers: {
            "Authorization": `Bearer ${token}`,
          },
          }
        );
        
        const record = response.data.university;
        console.log(record);

        const name = record.name;
        setName(name);
      } catch (err) {
        console.error("Error fetching student data:", err);
      }
    };
    fetchStudent();
  }, []);

  return (
    <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-6xl md:text-7xl font-extrabold mb-6 animate-fade-in">
          Secure Digital Credentials
        </h2>
        <p className="text-xl md:text-2xl mb-8 animate-fade-in delay-200">
          Empower your organization with verifiable blockchain credentials.
        </p>
        {name ? (
          <h4 className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-transform duration-300">
            Welcome Back {name}
          </h4>
        ) : (
          <a
            onClick={()=>{
              navigate("/auth");
            }}
            className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-transform duration-300"
          >
            Get Started
          </a>
        )}
      </div>
    </section>
  );
};

export default Hero;
