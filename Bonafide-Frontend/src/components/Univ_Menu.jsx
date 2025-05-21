// src/components/Menu.jsx
import { NavLink } from "react-router-dom";
import { BarChart, Table } from "lucide-react";

export default function Menu() {
  return (
    <div className="h-screen w-64 bg-gradient-to-b from-blue-900 to-green-700 text-white flex flex-col py-8 px-4 shadow-lg fixed left-0 top-0 z-10">
      <h1 className="text-2xl font-bold mb-10 text-center">🎓 Dashboard</h1>
      <nav className="flex flex-col space-y-4">
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-white/20 transition ${
              isActive ? "bg-white/20" : ""
            }`
          }
        >
          <BarChart className="w-5 h-5" />
          <span>Analytics</span>
        </NavLink>
        <NavLink
          to="/data"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-white/20 transition ${
              isActive ? "bg-white/20" : ""
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
