import React from "react";
import { Link } from "react-router-dom";
import { CirclePlus, LogOut } from "lucide-react";
import { useAuth } from "../context/authContext";

import { assets } from "../assets/assets";
import MenuItems from "./MenuItems";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div
      className={`w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col justify-between items-center
      max-sm:absolute top-0 bottom-0 z-20 transform
      ${sidebarOpen ? "translate-x-0" : "max-sm:-translate-x-full"}
      transition-all duration-300 ease-in-out`}
    >
      <div className="w-full">
        {/* Logo */}
        <img
          src={assets.logo}
          className="w-26 ml-7 cursor-pointer"
          alt="logo"
        />

        <hr className="border-gray-300 mb-8" />

        {/* Menu */}
        <MenuItems setSidebarOpen={setSidebarOpen} />

        {/* Create Post */}
        <Link
          to="/create-post"
          className="flex items-center justify-center gap-2 py-2.5 mt-6 rounded-lg
          bg-linear-to-r from-indigo-500 to-purple-600
          hover:from-indigo-700 hover:to-purple-800
          active:scale-95 transition text-white cursor-pointer"
        >
          <CirclePlus className="w-5 h-5" />
          Create Post
        </Link>
      </div>

      {/* User section */}
      <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between">
        <div className="flex gap-2 items-center cursor-pointer">
          {/* Profile picture */}
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
            {user?.profile_picture ? (
              <img
                src={user.profile_picture}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-indigo-600 font-semibold">
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </span>
            )}
          </div>

          {/* User information */}
          <div>
            <h1 className="text-sm font-medium">
              {user?.username || "User"}
            </h1>

            <p className="text-xs text-gray-500">
              @{user?.username || "user"}
            </p>
          </div>
        </div>

        {/* Logout */}
        <LogOut
          onClick={handleLogout}
          className="w-5 h-5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Sidebar;