import React, { useEffect, useState } from 'react';

const departments = ["BCA", "BSC", "MSC", "MCA", "EEE", "CSE"];

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [selectedDept, setSelectedDept] = useState("BCA");
  const [searchTerm, setSearchTerm] = useState("");
  const [cgpaFilter, setCgpaFilter] = useState({ direction: "above", value: "" });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:4000/get-data/data",{
  method: 'GET',
  credentials: 'include', // <== this is necessary
});
        const result = await response.json();
        if (response.ok && result.length > 0) {
          setStudents(result);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleSearch = (student) => {
    const term = searchTerm.toLowerCase();
    return (
      student.name?.toLowerCase().includes(term) ||
      student.registration_number?.toLowerCase().includes(term) ||
      student.aadhar_number?.includes(term)
    );
  };

  const handleCgpaFilter = (student) => {
    const value = parseFloat(cgpaFilter.value);
    const cgpa = parseFloat(student.cgpa);
    if (isNaN(value)) return true;
    return cgpaFilter.direction === "above" ? cgpa >= value : cgpa <= value;
  };

  const filteredStudents = students
    .filter((student) => student.department?.toUpperCase() === selectedDept)
    .filter(handleSearch)
    .filter(handleCgpaFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">Student Records</h1>

      {/* Department Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-4 py-2 rounded-full font-semibold shadow-md transition duration-300 ${
              selectedDept === dept
                ? "bg-white text-indigo-600"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-center gap-4 items-center mb-6">
        <input
          type="text"
          placeholder="Search by Name, Reg. No, Aadhar..."
          className="px-4 py-2 rounded-md w-full md:w-96 text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex items-center gap-2 text-black">
          <select
            className="px-2 py-2 rounded-md"
            value={cgpaFilter.direction}
            onChange={(e) =>
              setCgpaFilter((prev) => ({ ...prev, direction: e.target.value }))
            }
          >
            <option value="above">CGPA ≥</option>
            <option value="below">CGPA ≤</option>
          </select>

          <input
            type="number"
            placeholder="CGPA"
            className="px-4 py-2 rounded-md w-24"
            value={cgpaFilter.value}
            onChange={(e) =>
              setCgpaFilter((prev) => ({ ...prev, value: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-black rounded-lg overflow-hidden">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Aadhar</th>
              <th className="py-2 px-4 text-left">Reg. No</th>
              <th className="py-2 px-4 text-left">Department</th>
              <th className="py-2 px-4 text-left">CGPA</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr
                  key={student._id}
                  className="border-b hover:bg-gray-100 transition-colors"
                >
                  <td className="py-2 px-4">{student.name}</td>
                  <td className="py-2 px-4">{student.email}</td>
                  <td className="py-2 px-4">{student.aadhar_number}</td>
                  <td className="py-2 px-4">{student.registration_number || "N/A"}</td>
                  <td className="py-2 px-4">{student.department}</td>
                  <td className="py-2 px-4">{student.cgpa || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No matching students found in {selectedDept}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
