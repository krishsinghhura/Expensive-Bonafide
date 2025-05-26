import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Menu from "../components/Univ_Menu";
import axios from "axios";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

export default function Records() {
  const [academicYears, setAcademicYears] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/auth");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4000/get-data/data", {
          withCredentials: true,
        });
        
        const records = response.data.data;
        
        // Process data to extract departments and academic years
        const deptSet = new Set();
        const yearSet = new Set();
        
        records.forEach((student) => {
          deptSet.add(student.DEPARTMENT);
          
          if (student.createdAt) {
            const date = new Date(student.createdAt);
            const year = date.getFullYear();
            const academicYear = `${year}-${String((year + 1) % 100).padStart(2, "0")}`;
            yearSet.add(academicYear);
          }
        });

        const sortedYears = Array.from(yearSet).sort().reverse();
        const sortedDepts = Array.from(deptSet).sort();

        setAcademicYears(sortedYears);
        setDepartments(sortedDepts);
        setStudentData(records);
        setSelectedYear(sortedYears[0] || "");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Failed to load student data. Please try again later.");
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleDeptClick = (dept) => {
    setSelectedDept(dept);
    setSearchQuery("");
  };

  const filteredData = studentData.filter((student) => {
    if (selectedDept && student.DEPARTMENT !== selectedDept) return false;
    
    if (selectedYear) {
      if (!student.createdAt) return false;
      const date = new Date(student.createdAt);
      const year = date.getFullYear();
      const academicYear = `${year}-${String((year + 1) % 100).padStart(2, "0")}`;
      if (academicYear !== selectedYear) return false;
    }
    
    const searchString = [
      student.NAME,
      student.EMAIL,
      student["REGISTRATION NUMBER"],
      student.DEPARTMENT,
      selectedYear,
    ].join(" ").toLowerCase();
    
    return searchString.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex bg-white min-h-screen">
      <Menu />
      <div className="ml-64 flex-1 flex flex-col justify-between">
        <Header />
        <main className="flex-grow flex flex-col p-6">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          ) : (
            <>
              {/* Academic Year Filter */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6 shadow-sm">
                <h2 className="text-lg font-semibold text-blue-800 mb-3">Academic Year</h2>
                <div className="flex flex-wrap gap-2">
                  {academicYears.map((year, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedYear(year)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedYear === year
                          ? "bg-blue-600 text-white"
                          : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Department Selection */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6 shadow-sm">
                <h2 className="text-lg font-semibold text-blue-800 mb-3">Departments</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {departments.map((dept, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleDeptClick(dept)}
                      className={`p-4 bg-white rounded-lg cursor-pointer transition-all shadow-sm border ${
                        selectedDept === dept 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <h3 className="font-medium text-blue-700">{dept}</h3>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search and Results Section */}
              {(selectedDept || selectedYear) && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-blue-50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <h2 className="text-xl font-semibold text-blue-800">
                        {selectedDept && `${selectedDept} `}
                        {selectedYear && `${selectedYear} `}
                        Students
                      </h2>
                      <div className="relative w-full md:w-96">
                        <input
                          type="text"
                          placeholder="Search students..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        <svg
                          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-blue-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                            Reg No.
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                            CGPA
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.length > 0 ? (
                          filteredData.map((student, idx) => (
                            <tr key={idx} className="hover:bg-blue-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {student.NAME}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.EMAIL}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student["REGISTRATION NUMBER"]}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.CGPA}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  student.blockchainTxnHash 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-yellow-100 text-yellow-800"
                                }`}>
                                  {student.blockchainTxnHash ? "Verified" : "Unverified"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => {
                                    // Add view details functionality
                                  }}
                                  className="text-blue-600 hover:text-blue-900 mr-3"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => {
                                    // Add download functionality
                                  }}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  Download
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                              No students found matching your criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {filteredData.length > 0 && (
                    <div className="px-4 py-3 bg-blue-50 border-t border-gray-200 flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredData.length}</span> of{' '}
                        <span className="font-medium">{filteredData.length}</span> results
                      </div>
                      <div className="flex space-x-2">
                        <button
                          disabled
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-white"
                        >
                          Previous
                        </button>
                        <button
                          disabled
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-white"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}