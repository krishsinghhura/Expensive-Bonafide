import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Menu from "../components/Univ_Menu";

const academicYears = ["2021-22", "2022-23", "2023-24"];
const departments = ["CSE", "ECE", "ME", "CE", "EE"];

const dummyData = {
  "CSE-2023-24": [
    {
      NAME: "Amit Sharma",
      EMAIL: "amit@example.com",
      REGISTRATION_NUMBER: "CSE2301",
      CGPA: "9.2",
      claimStatus: "Verified",
    },
    {
      NAME: "Nikita Rao",
      EMAIL: "nikita@example.com",
      REGISTRATION_NUMBER: "CSE2302",
      CGPA: "8.7",
      claimStatus: "Verified",
    },
  ],
  "ECE-2023-24": [
    {
      NAME: "Rahul Yadav",
      EMAIL: "rahul@example.com",
      REGISTRATION_NUMBER: "ECE2301",
      CGPA: "8.5",
      claimStatus: "Unverified",
    },
  ],
};

export default function Records() {
  const [academicYears, setAcademicYears] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="flex bg-gray-100 min-h-screen text-black">
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
                    ? "bg-blue-600 text-white"
                    : "bg-blue-300/40 hover:bg-blue-400/50"
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
                className="w-60 h-32 bg-sky-500 text-black rounded-4xl flex items-center justify-center text-center cursor-pointer hover:scale-105 transition-all shadow-2xl"
              >
                <h3 className="text-2xl text-white font-bold ">{dept}</h3>
              </div>
            ))}
          </div>

          {/* Search and Table */}
          {selectedDept && (
            <>
              <div className="flex justify-center mb-4">
                <div className="bg-white border border-black rounded-lg px-4 py-2 w-[60%] shadow-2xl">
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
                <div className="bg-white border border-blue-500/30 p-6 rounded-xl shadow-2xl text-black">
                  <h2 className="text-xl font-semibold mb-4">
                    {selectedDept} - {selectedYear} Students
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto text-left">
                      <thead className="bg-blue-300/40">
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
                              <td className="p-2">{student.NAME}</td>
                              <td className="p-2">{student.EMAIL}</td>
                              <td className="p-2">{student.REGISTRATION_NUMBER}</td>
                              <td className="p-2">{student.CGPA}</td>
                              <td className="p-2">{student.claimStatus}</td>
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
