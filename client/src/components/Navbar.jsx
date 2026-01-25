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

  // Switch user role to owner
  const handleListCars = () => {
    if (token) {
      navigate("/owner");
    } else {
      toast.error("Please LogIn first");
    }
  };

  // Filter menu links based on login status
  const filteredMenuLinks = token
    ? menuLinks
    : menuLinks.filter((link) => link.name === "Home" || link.name === "Cars");

  // Add List Your Cars link for non-logged-in users
  const displayLinks = !token
    ? [
        ...filteredMenuLinks,
        { name: "List Your Cars", path: "#", isAction: true },
      ]
    : filteredMenuLinks;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between !px-6 md:!px-16 lg:!px-24 xl:!px-32 !py-2 text-gray-600 border-b border-borderColor relative bg-light"
    >
      {/* Logo */}
      <Link to="/">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={assets.logo}
          alt="Logo"
          className="h-16"
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
        <div className="flex max-sm:flex-col items-start sm:items-center gap-6">
          {user && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => navigate("/profile")}
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
          )}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="cursor-pointer !px-8 !py-2 bg-purple-600 hover:bg-purple-700 transition-all rounded-lg text-white"
            >
              Admin Panel
            </button>
          )}
          {token && (
            <button
              onClick={() => (isOwner ? navigate("/owner") : changeRole())}
              className="cursor-pointer"
            >
              {isOwner ? "Dashboard" : "List Cars"}
            </button>
          )}
          {!token && (
            <button
              onClick={() => setShowLogin(true)}
              className="cursor-pointer !px-8 !py-2 bg-primary hover:bg-primary-dull transition-all rounded-lg text-white"
            >
              Login
            </button>
          )}
          {user && (
            <button
              onClick={logout}
              className="cursor-pointer !px-6 !py-2 bg-red-500 hover:bg-red-600 transition-all rounded-lg text-white text-sm font-medium"
            >
              Logout
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
