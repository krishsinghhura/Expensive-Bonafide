import { NavLink } from "react-router-dom";
import { BarChart, Table } from "lucide-react";

export default function Menu() {
  return (
    <div className="h-screen w-64 bg-white/10 backdrop-blur-lg text-black border-r border-black/10 shadow-md flex flex-col py-8 px-4 fixed left-0 top-0 z-10">
      <h1 className="text-2xl font-bold mb-10 text-center text-blue-800">🎓 Dashboard</h1>
      <nav className="flex flex-col space-y-4">
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-2 rounded-md font-medium transition ${
              isActive
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`
          }
        >
          <BarChart className="w-5 h-5" />
          <span>Analytics</span>
        </NavLink>
        <NavLink
          to="/data"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-2 rounded-md font-medium transition ${
              isActive
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`
          }
        >
          <Table className="w-5 h-5" />
          <span>View Records</span>
        </NavLink>
      </nav>
    </div>
  );
}
