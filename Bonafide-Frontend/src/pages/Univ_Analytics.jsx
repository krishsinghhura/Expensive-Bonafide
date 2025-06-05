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
  ResponsiveContainer
} from "recharts";
import { useNavigate } from "react-router-dom";

const COLORS = ["#3182ce", "#e53e3e", "#805ad5", "#d69e2e"];

export default function Analytics() {
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    if (!token) {
      navigate("/auth");
    }
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const Token = localStorage.getItem('token');
        const response = await axios.get("https://expensive-bonafide-production.up.railway.app/get-data/data", {
          headers: {
            "Authorization": `Bearer ${Token}`,
          },
        });

        const students = response.data.data;

        const departmentMap = {};
        let verified = 0;
        let unverified = 0;
        let claimed = 0;
        let unclaimed = 0;

        students.forEach((student) => {
          const dept = student.department || "Unknown";
          const isVerified = Boolean(student.blockchainTxnHash);
          const isClaimed = Boolean(student.claimed);

          if (!departmentMap[dept]) {
            departmentMap[dept] = {
              name: dept,
              Verified: 0,
              Unverified: 0,
              Claimed: 0,
              Unclaimed: 0,
              total: 0
            };
          }

          if (isVerified) {
            departmentMap[dept].Verified += 1;
            verified += 1;
          } else {
            departmentMap[dept].Unverified += 1;
            unverified += 1;
          }

          if (isClaimed) {
            departmentMap[dept].Claimed += 1;
            claimed += 1;
          } else {
            departmentMap[dept].Unclaimed += 1;
            unclaimed += 1;
          }

          departmentMap[dept].total += 1;
        });

        // Sort departments by total students
        const sortedDepartments = Object.values(departmentMap).sort(
          (a, b) => b.total - a.total
        );

        setBarData(sortedDepartments);
        setPieData([
          { name: "Verified", value: verified },
          { name: "Unverified", value: unverified },
          { name: "Claimed", value: claimed },
          { name: "Unclaimed", value: unclaimed },
        ]);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError("Failed to load analytics data. Please try again later.");
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      <Menu />
      <div className="ml-64 flex-1 flex flex-col">
        <Header />
        <main className="p-8 flex-grow">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-800">Student Analytics Dashboard</h2>
            <p className="text-gray-600">Visual insights into student verification and claim status</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <div className="space-y-10">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                  <h3 className="text-sm font-medium text-blue-800 uppercase tracking-wider">
                    Total Students
                  </h3>
                  <p className="mt-2 text-3xl font-semibold text-blue-600">
                    {barData.reduce((sum, dept) => sum + dept.total, 0)}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                  <h3 className="text-sm font-medium text-green-800 uppercase tracking-wider">
                    Verified Students
                  </h3>
                  <p className="mt-2 text-3xl font-semibold text-green-600">
                    {pieData.find(item => item.name === "Verified")?.value || 0}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
                  <h3 className="text-sm font-medium text-purple-800 uppercase tracking-wider">
                    Claimed Students
                  </h3>
                  <p className="mt-2 text-3xl font-semibold text-purple-600">
                    {pieData.find(item => item.name === "Claimed")?.value || 0}
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-6 border border-red-100">
                  <h3 className="text-sm font-medium text-red-800 uppercase tracking-wider">
                    Unverified Students
                  </h3>
                  <p className="mt-2 text-3xl font-semibold text-red-600">
                    {pieData.find(item => item.name === "Unverified")?.value || 0}
                  </p>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">
                    Status by Department
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={barData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <XAxis 
                          dataKey="name" 
                          angle={-45} 
                          textAnchor="end"
                          height={70}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.375rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="Verified" fill="#3182ce" name="Verified" />
                        <Bar dataKey="Claimed" fill="#805ad5" name="Claimed" />
                        <Bar dataKey="Unverified" fill="#e53e3e" name="Unverified" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">
                    Overall Status Distribution
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          innerRadius={40}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} students`, 'Count']}
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.375rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend 
                          layout="horizontal" 
                          verticalAlign="bottom"
                          align="center"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Department Table */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                  <h3 className="text-lg font-semibold text-blue-800">
                    Detailed Department Statistics
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          Verified
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          Claimed
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          Verification Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          Claim Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {barData.map((dept, index) => (
                        <tr key={index} className="hover:bg-blue-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {dept.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {dept.total}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {dept.Verified}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {dept.Claimed}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-blue-600 h-2.5 rounded-full"
                                  style={{
                                    width: `${(dept.Verified / dept.total) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="ml-2 text-xs font-medium">
                                {Math.round((dept.Verified / dept.total) * 100)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-purple-600 h-2.5 rounded-full"
                                  style={{
                                    width: `${(dept.Claimed / dept.total) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="ml-2 text-xs font-medium">
                                {Math.round((dept.Claimed / dept.total) * 100)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}