import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { useState } from "react";
import { motion } from "framer-motion";

// Navbar for the Owner dashboard
const NavbarOwner = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const [profileDropdown, setProfileDropdown] = useState(false);

  return (
    <div
      className="flex justify-between items-center !px-6
                        md:!px-10 !py-5 border-b border-borderColor
                        relative transition-all bg-white shadow-sm"
    >
      {/* Logo linking to homepage */}
      <Link to="/" className="hover:opacity-80 transition-opacity">
        <img src={assets.logo} alt="Logo" className="h-12" />
      </Link>

      {/* Centered Welcome message */}
      <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-800">
            Welcome back, {user?.name?.split(" ")[0] || "Owner"}!
          </p>
          <p className="text-xs text-gray-500 !mt-0.5">
            Manage your cars and bookings
          </p>
        </div>
      </div>

      {/* User info on right */}
      <div className="flex items-center gap-4 ml-auto relative">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-800">
            {user?.name || "Owner"}
          </p>
          <p className="text-xs text-gray-500">
            {user?.email || "owner@example.com"}
          </p>
        </div>
        <button
          onClick={() => setProfileDropdown(!profileDropdown)}
          className="cursor-pointer w-11 h-11 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-2 border-blue-500 hover:border-blue-600 hover:shadow-md transition-all"
        >
          {user?.image ? (
            <img
              src={user.image}
              alt={user?.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              className="w-6 h-6 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Profile Dropdown */}
        {profileDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-48"
            onMouseLeave={() => setProfileDropdown(false)}
          >
            <div className="p-3 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-900">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>

            <div className="py-2">
              <button
                onClick={() => {
                  navigate("/profile");
                  setProfileDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                My Profile
              </button>
            </div>

            <div className="border-t border-gray-200 py-2">
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                  setProfileDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NavbarOwner;
