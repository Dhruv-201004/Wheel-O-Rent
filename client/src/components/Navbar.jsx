import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets, menuLinks } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const Navbar = () => {
  const {
    setShowLogin,
    user,
    logout,
    isOwner,
    isAdmin,
    axios,
    setIsOwner,
    token,
  } = useAppContext();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const navigate = useNavigate();

  // Switch user role to owner
  const changeRole = async () => {
    try {
      const { data } = await axios.post("/api/owner/change-role");
      if (data.success) {
        setIsOwner(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Navigate to add car page
  const handleListCars = () => {
    if (token) {
      navigate("/owner/add-car");
    } else {
      toast.error("Please LogIn first");
    }
  };

  // Filter menu links based on login status
  const filteredMenuLinks = token
    ? menuLinks
    : menuLinks.filter((link) => link.name === "Home" || link.name === "Cars");

  // Add List Your Cars link after Cars
  const displayLinks = [
    ...filteredMenuLinks.slice(0, 2), // Home and Cars
    { name: "List your Car", path: "#", isAction: true },
    ...filteredMenuLinks.slice(2), // My Bookings (only for logged-in users)
  ];

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between !px-4 sm:!px-6 md:!px-8 lg:!px-16 xl:!px-24 2xl:!px-32 !py-2 text-gray-600 border-b border-borderColor relative bg-light"
    >
      {/* Logo */}
      <Link to="/" className="flex-shrink-0">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={assets.logo}
          alt="Logo"
          className="h-12 sm:h-14 md:h-16"
        />
      </Link>

      {/* Navigation Links */}
      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor 
        !right-0 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 max-sm:!p-4 bg-light transition-all duration-300 z-50 
        ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
      >
        {displayLinks.map((link, index) =>
          link.isAction ? (
            <button
              key={index}
              onClick={handleListCars}
              className="text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              {link.name}
            </button>
          ) : (
            <Link
              key={index}
              to={link.path}
              className="text-gray-700 hover:text-gray-900"
            >
              {link.name}
            </Link>
          ),
        )}

        {/* Role Action + Auth Button */}
        <div className="flex max-sm:flex-col items-start sm:items-center gap-6 relative">
          {user && (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="cursor-pointer w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-2 border-blue-500 hover:border-blue-600 transition-all"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
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
              </motion.button>

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
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
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

                    <button
                      onClick={() => {
                        navigate("/owner");
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
                          d="M8 7h12M8 11h12m-12 4h12m2-12H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2z"
                        />
                      </svg>
                      Dashboard
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
          )}
          {!user && !token && (
            <button
              onClick={() => setShowLogin(true)}
              className="cursor-pointer !px-8 !py-2 bg-primary hover:bg-primary-dull transition-all rounded-lg text-white"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="sm:hidden cursor-pointer"
        aria-label="Menu"
        onClick={() => setOpen(!open)}
      >
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
      </button>
    </motion.div>
  );
};

export default Navbar;
