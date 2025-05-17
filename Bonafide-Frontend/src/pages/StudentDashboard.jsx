import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const token = Cookies.get("StudentToken");

  useEffect(() => {
    if (!token) {
      alert("Unauthorized. Please log in.");
      navigate("/");
      return;
    }

    const fetchStudentData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/student/dashboard-data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudent(response.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
        alert("Unauthorized or session expired. Please log in again.");
        navigate("/");
      }
    };

    fetchStudentData();
  }, [token, navigate]);

  const handleLogout = () => {
    Cookies.remove("StudentToken");
    navigate("/");
  };

  const goToVerifyPage = () => {
    navigate("/verify-student");
  };

  if (!student) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-400 to-pink-500 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-purple-700">Student Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>

        <div className="space-y-4 text-gray-800 text-lg">
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Department:</strong> {student.department}</p>
          <p><strong>CGPA:</strong> {student.cgpa}</p>
          <p><strong>Aadhar Number:</strong> {student.aadhar_number}</p>
          <p><strong>Registration Number:</strong> {student.registration_number}</p>
          <p><strong>Blockchain Txn Hash:</strong> <br /><span className="break-all text-sm text-gray-600">{student.blockchainTxnHash}</span></p>
          <p><strong>Created At:</strong> {new Date(student.createdAt).toLocaleString()}</p>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={goToVerifyPage}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
