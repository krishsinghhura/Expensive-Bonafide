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
        const response = await axios.get("https://bonafide-backend.onrender.com/get-data/data", {
          withCredentials: true,
        });
        
        const records = response.data.data;
        console.log("Fetched records:", records);
        
        // Process data to extract departments and academic years
        const deptSet = new Set();
        const yearSet = new Set();
        
        records.forEach((student) => {
          if (student.department) {
            deptSet.add(student.department);
          }
          
          if (student.createdAt) {
            const date = new Date(student.createdAt);
            const year = date.getFullYear();
            const academicYear = `${year}-${String(year + 1).slice(-2)}`;
            yearSet.add(academicYear);
          }
        });

        const sortedYears = Array.from(yearSet).sort((a, b) => b.localeCompare(a));
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
    setSelectedDept(selectedDept === dept ? "" : dept);
    setSearchQuery("");
  };

  const handleYearClick = (year) => {
    setSelectedYear(selectedYear === year ? "" : year);
  };

  const filteredData = studentData.filter((student) => {
    // Filter by department if selected
    if (selectedDept && student.department !== selectedDept) return false;
    
    // Filter by academic year if selected
    if (selectedYear && student.createdAt) {
      const date = new Date(student.createdAt);
      const year = date.getFullYear();
      const academicYear = `${year}-${String(year + 1).slice(-2)}`;
      if (academicYear !== selectedYear) return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const searchString = [
        student.name,
        student.email,
        student.registration_number || "",
        student.department || "",
      ].join(" ").toLowerCase();
      
      return searchString.includes(searchQuery.toLowerCase());
    }
    
    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleView = (student) => {
    // Implement view functionality
    console.log("View student:", student);
    // You might want to navigate to a detailed view or show a modal
  };

  const handleDownload = (student) => {
    // Implement download functionality
    console.log("Download student data:", student);
    if (student.CertificateUrl) {
      window.open(student.CertificateUrl, '_blank');
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Menu />
      <div className="ml-64 flex-1 flex flex-col">
        <Header />
        <main className="flex-grow p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Filters Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                </div>
                
                {/* Academic Year Filter */}
                {academicYears.length > 0 && (
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Academic Year</h3>
                    <div className="flex flex-wrap gap-2">
                      {academicYears.map((year, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleYearClick(year)}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                            selectedYear === year
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Department Filter */}
                {departments.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Departments</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {departments.map((dept, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleDeptClick(dept)}
                          className={`p-3 rounded-md text-sm font-medium transition-all text-left truncate ${
                            selectedDept === dept
                              ? "bg-blue-100 text-blue-800 border border-blue-300"
                              : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Results Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Student Records
                    </h2>
                    {(selectedDept || selectedYear) && (
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedDept && <span>Department: {selectedDept}</span>}
                        {selectedDept && selectedYear && <span> • </span>}
                        {selectedYear && <span>Academic Year: {selectedYear}</span>}
                      </p>
                    )}
                  </div>
                  
                  <div className="relative w-full md:w-80">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                {filteredData.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Reg No.
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Department
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date Added
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredData.map((student, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{student.name || "N/A"}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {student.registration_number || "N/A"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{student.department || "N/A"}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{student.email || "N/A"}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{formatDate(student.createdAt)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  student.blockchainTxnHash 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-yellow-100 text-yellow-800"
                                }`}>
                                  {student.blockchainTxnHash ? "Verified" : "Pending"}
                                </span>
                                {student.claimed && (
                                  <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                    Claimed
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {/* <button 
                                  onClick={() => handleView(student)}
                                  className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                  View
                                </button> */}
                                <button 
                                  onClick={() => handleDownload(student)}
                                  className="text-blue-600 hover:text-blue-900 cursor-pointer"
                                >
                                  Download
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between sm:px-6">
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredData.length}</span> of{' '}
                            <span className="font-medium">{filteredData.length}</span> results
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                              disabled
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                              <span className="sr-only">Previous</span>
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button
                              disabled
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                              <span className="sr-only">Next</span>
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {selectedDept || selectedYear || searchQuery
                        ? "Try adjusting your filters or search query"
                        : "No student records available"}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}