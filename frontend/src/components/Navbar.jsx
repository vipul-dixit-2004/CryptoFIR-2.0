// src/components/Navbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <div className="text-white text-lg font-bold">Dashboard</div>
        <div className="space-x-4">
          <NavLink
            to="/FileFIR"
            className="text-gray-300 hover:text-white"
            activeClassName="text-white"
          >
            Register New FIR
          </NavLink>
          <NavLink
            to="/searchFIR"
            className="text-gray-300 hover:text-white"
            activeClassName="text-white"
          >
            Search FIR
          </NavLink>
          <NavLink
            to="/logout"
            className="text-red-600 hover:text-white"
            activeClassName="text-white"
          >
            Logout
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
