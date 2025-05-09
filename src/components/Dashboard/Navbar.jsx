import React from "react";
import { FaHome, FaBell, FaSearch } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/logo heart.svg"
export default function Navbar({ onHomeClick }) {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="h-16 w-full px-6 bg-black flex items-center justify-between">
      {/* Left: Logo (can be hidden if not used) */}
      <div className="flex items-center gap-4 w-1/4">
        <img src={logo} alt="Rhythym" className="h-8" />
      </div>

      {/* Center: Home + Search */}
      <div className="flex items-center gap-4 w-2/4 justify-center mt-2">
        <Link to="/dashboard">
          <button
            className="p-3 bg-white/10 rounded-full hover:bg-white/20"
            onClick={onHomeClick}
          >
            <FaHome className="text-white text-lg" />
          </button>
        </Link>

        <div className="flex items-center bg-white/10 text-white rounded-full px-4 py-3 w-full max-w-xl">
          <FaSearch className="mr-2 text-gray-400" />
          <input
            type="text"
            placeholder="What do you want to play?"
            className="bg-transparent outline-none w-full placeholder-gray-400 text-sm"
          />
          <FiPackage className="ml-2 text-gray-400" />
        </div>
      </div>

      {/* Right: Bell + Avatar */}
      <div className="flex items-center gap-4 w-1/4 justify-end relative">
        <FaBell className="text-white cursor-pointer hover:text-green-500 text-lg" />
        <img
          alt="Profile"
          className="w-8 h-8 rounded-full border border-white/10 cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute top-14 right-6 bg-white/10 text-white rounded shadow-lg p-2 z-50">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-white/20 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
