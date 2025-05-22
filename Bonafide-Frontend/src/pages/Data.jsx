import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Menu from "../components/Univ_Menu";
import axios from "axios";

export default function Records() {
  const [academicYears, setAcademicYears] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [studentData, setStudentData] = useState({});

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/get-data/data",{
          withCredentials : true,
        });
        console.log("api hit");
        
        const records = response.data.data;


        const deptSet = new Set();
        const yearSet = new Set();
        const grouped = {};

        records.forEach((student) => {
          // Extract department
          const dept = student.department;
          deptSet.add(dept);

          // Extract academic year from createdAt
          const date = new Date(student.createdAt);
          const year = date.getFullYear();
          const academicYear = `${year}-${String((year + 1) % 100).padStart(
            2,
            "0"
          )}`;
          yearSet.add(academicYear);

          // Group by dept + year
          const key = `${dept}-${academicYear}`;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(student);
        });

        const sortedYears = Array.from(yearSet).sort().reverse();
        const sortedDepts = Array.from(deptSet).sort();

        setAcademicYears(sortedYears);
        setDepartments(sortedDepts);
        setStudentData(grouped);
        setSelectedYear(sortedYears[0]); // default to latest year
      } catch (err) {
        console.error("Error fetching student data:", err);
      }
    };

    fetchStudentData();
  }, []);

  const handleDeptClick = (dept) => {
    setSelectedDept(dept);
    setSearchQuery("");
  };

  const filteredData =
    studentData[`${selectedDept}-${selectedYear}`]?.filter((student) =>
      [
        student.name,
        student.email,
        student.registration_number,
        selectedDept,
        selectedYear,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="flex bg-gradient-to-br from-blue-900 via-blue-700 to-green-500 min-h-screen text-black">
      <Menu />
      <div className="ml-64 flex-1 flex flex-col justify-between">
        <Header />
        <main className="flex-grow flex flex-col">
          {/* Academic Year Slider */}
          <div className="flex justify-center mt-6 space-x-4">
            {academicYears.map((year, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedYear === year
                    ? "bg-teal-600 text-white"
                    : "bg-teal-300/40 hover:bg-teal-400/50"
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Department Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-8 justify-items-center">
            {departments.map((dept, idx) => (
              <div
                key={idx}
                onClick={() => handleDeptClick(dept)}
                className="w-60 h-32 bg-white text-black rounded-2xl flex items-center justify-center text-center cursor-pointer hover:scale-105 transition-all shadow-lg"
              >
                <h3 className="text-lg font-semibold">{dept}</h3>
              </div>
            ))}
          </div>

          {/* Search and Table */}
          {selectedDept && (
            <>
              <div className="flex justify-center mb-4">
                <div className="bg-white border border-black rounded-lg px-4 py-2 w-[60%] shadow-md">
                  <input
                    type="text"
                    placeholder="Search by Name, Dept, Year, or Reg. No."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent outline-none text-black placeholder-black"
                  />
                </div>
              </div>

              <div className="px-6 pb-10">
                <div className="bg-white border border-green-500/30 p-6 rounded-xl shadow-lg text-black">
                  <h2 className="text-xl font-semibold mb-4">
                    {selectedDept} - {selectedYear} Students
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto text-left">
                      <thead className="bg-green-300/40">
                        <tr>
                          <th className="p-2">Name</th>
                          <th className="p-2">Email</th>
                          <th className="p-2">Reg No.</th>
                          <th className="p-2">CGPA</th>
                          <th className="p-2">Claim Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.length > 0 ? (
                          filteredData.map((student, idx) => (
                            <tr key={idx} className="hover:bg-green-100/50">
                              <td className="p-2">{student.name}</td>
                              <td className="p-2">{student.email}</td>
                              <td className="p-2">
                                {student.registration_number}
                              </td>
                              <td className="p-2">{student.cgpa}</td>
                              <td className="p-2">
                                {student.claimed ? "Claimed" : "Unclaimed"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center p-4">
                              No student found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
