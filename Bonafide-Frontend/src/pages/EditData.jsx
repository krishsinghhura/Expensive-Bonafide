// EditData.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const EditData = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingData, setEditingData] = useState(null);
  const navigate = useNavigate();

  // Fetch data from Redis on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://bonafide-backend.onrender.com/api/fetch");
        const result = await response.json();
        if (response.ok) {
          setStudents(result.data);
        } else {
          alert(`❌ Failed to fetch: ${result.error}`);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("❌ Error fetching from Redis.");
      }
    };
    fetchData();
  }, []);

  // Handle editing changes in the table
  const handleInputChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  // Save changes to Redis
  const handleSaveChanges = async () => {
    try {
      const response = await fetch("https://bonafide-backend.onrender.com/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: students }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("✅ Changes saved to Redis!");
        navigate("/validate")
      } else {
        alert(`❌ Failed to save changes: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("❌ Something went wrong while saving changes.");
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter((student) =>
    student["AADHAR NUMBER"]?.includes(searchTerm)
  );

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <Header/>
      <h2 className="text-2xl text-blue-700 font-semibold mb-4">✏️ Edit Student Data</h2>

      {/* Search Bar */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by AADHAR number"
        className="mb-4 p-2 border-2 border-blue-300 rounded w-full max-w-md"
      />

      {/* Data Table */}
      <table className="w-full mt-8 border-collapse border border-gray-300">
        <thead>
          <tr>
            {Object.keys(filteredStudents[0] || {}).map((key) => (
              <th key={key} className="border p-2 bg-blue-100">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student, index) => (
            <tr key={index} className="hover:bg-blue-200">
              {Object.entries(student).map(([key, value]) => (
                <td key={key} className="border p-2">
                  {key !== "errors" ? (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        handleInputChange(index, key, e.target.value)
                      }
                      className="w-full p-1 border border-gray-300 rounded"
                    />
                  ) : (
                    value
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Save Changes Button */}
      <button
        onClick={handleSaveChanges}
        className="mt-4 p-3 w-full bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
      >
        💾 Save Changes
      </button>
      <Footer/>
    </div>
  );
};

export default EditData;
