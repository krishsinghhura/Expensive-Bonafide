import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [kpiCounts, setKpiCounts] = useState({
    totalStudents: 0,
    certificatesGenerated: 0,
    blockchainTxns: 0,
    certificatesClaimed: 0,
  });

  useEffect(() => {
    alert("started");
    axios
      .get("http://localhost:4000/get-data/data", {
        withCredentials: true,
      })
      .then((res) => {
        const allData = res.data;
        alert("done")
        setData(allData);

        // Extract unique departments
        const deptSet = new Set(allData.map((item) => item.department));
        const deptArray = Array.from(deptSet);
        setDepartments(deptArray);
        setSelectedDept(deptArray[0]); // Select first dept by default

        // Calculate KPIs
        const totalStudents = allData.length;
        const blockchainTxns = allData.filter((item) => item.txHash).length;
        const certificatesGenerated = blockchainTxns;
        const certificatesClaimed = allData.filter(
          (item) => item.status === "Claimed"
        ).length;

        setKpiCounts({
          totalStudents,
          certificatesGenerated,
          blockchainTxns,
          certificatesClaimed,
        });
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  const filteredData = data.filter((item) => item.department === selectedDept);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-black font-sans">
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 h-screen bg-white/10 backdrop-blur-md p-6 space-y-6 rounded-tr-3xl rounded-br-3xl shadow-lg">
          <nav className="flex flex-col space-y-4 text-black">
            <a href="#" className="text-lg font-medium hover:text-blue-300">
              Dashboard
            </a>

            <div>
              <h2 className="text-sm uppercase text-white">Departments</h2>
              <select
                className="mt-2 w-full bg-white/20 text-white p-2 rounded-lg backdrop-blur-sm hover:bg-white/30 focus:outline-none"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                {departments.map((dept, idx) => (
                  <option key={idx} value={dept} className="text-black">
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <a href="#" className="text-white font-medium hover:text-blue-300">
              Certificates
            </a>
            <a href="#" className="text-white font-medium hover:text-blue-300">
              Blockchain Activity
            </a>
            <a href="#" className="text-white font-medium hover:text-blue-300">
              Claims Summary
            </a>
            <a href="#" className="text-white font-medium hover:text-blue-300">
              Settings
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 text-black">
            {[
              {
                title: "Certificates Generated",
                count: kpiCounts.certificatesGenerated,
              },
              { title: "Blockchain Txns", count: kpiCounts.blockchainTxns },
              {
                title: "Certificates Claimed",
                count: kpiCounts.certificatesClaimed,
              },
              { title: "Total Students", count: kpiCounts.totalStudents },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white bg-opacity-10 rounded-xl p-6 shadow-lg hover:scale-105 transform transition duration-300"
              >
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-3xl font-bold">{item.count}</p>
              </div>
            ))}
          </div>

          {/* Student Table */}
          <section className="bg-white bg-opacity-10 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {selectedDept} Student List
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-left">
                <thead className="text-sm uppercase text-black">
                  <tr>
                    <th className="p-2">Student ID</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Issue Date</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((student, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-white hover:bg-opacity-10"
                    >
                      <td className="p-2">{student.id}</td>
                      <td className="p-2">{student.name}</td>
                      <td className="p-2">{student.email}</td>
                      <td className="p-2">{student.status}</td>
                      <td className="p-2">{student.date || "-"}</td>
                      <td className="p-2 space-x-2">
                        <button className="bg-blue-400 px-3 py-1 rounded-lg text-sm hover:bg-blue-500">
                          View
                        </button>
                        <button className="bg-purple-400 px-3 py-1 rounded-lg text-sm hover:bg-purple-500">
                          Reissue
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center p-4 text-white/70">
                        No data available for this department.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
