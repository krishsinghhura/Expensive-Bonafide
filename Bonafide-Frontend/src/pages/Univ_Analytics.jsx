// pages/analytics.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Menu from "../components/Univ_Menu";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#38b2ac", "#f56565"];

export default function Analytics() {
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get("http://localhost:4000/get-data/data", {
          withCredentials: true, // sends cookies for auth
        });

        const students = response.data.data;

        const departmentMap = {};
        let verified = 0;
        let unverified = 0;

        students.forEach((student) => {
          const dept = student.department || "Unknown";
          const isVerified = student.claimed;

          if (!departmentMap[dept]) {
            departmentMap[dept] = {
              name: dept,
              Verified: 0,
              Unverified: 0,
            };
          }

          if (isVerified) {
            departmentMap[dept].Verified += 1;
            verified += 1;
          } else {
            departmentMap[dept].Unverified += 1;
            unverified += 1;
          }
        });

        setBarData(Object.values(departmentMap));
        setPieData([
          { name: "Verified", value: verified },
          { name: "Unverified", value: unverified },
        ]);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      <Menu />
      <div className="ml-64 flex-1 flex flex-col">
        <Header />
        <main className="p-6 space-y-10 flex-grow">
          <h2 className="text-2xl font-bold">📊 Student Analytics Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bar Chart */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Department Verification Summary</h3>
              <BarChart width={450} height={300} data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Verified" fill="#38b2ac" />
                <Bar dataKey="Unverified" fill="#f56565" />
              </BarChart>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-lg p-6 shadow-lg flex justify-center">
              <div>
                <h3 className="text-lg font-semibold mb-4">Overall Verification Ratio</h3>
                <PieChart width={300} height={300}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
