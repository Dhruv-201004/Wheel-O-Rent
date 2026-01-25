import { NavLink, useLocation } from "react-router-dom";
import { ownerMenuLinks } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

// Sidebar for the Owner dashboard
const Sidebar = () => {
  const { user } = useAppContext();
  const location = useLocation();

  return (
    <div
      className="relative min-h-screen md:flex flex-col items-center !pt-6
                    max-w-16 md:max-w-64 w-full border-r border-borderColor text-sm bg-white shadow-sm"
    >
      {/* Navigation links */}
      <div className="w-full !px-2 md:!px-3">
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={`relative flex items-center gap-3 w-full !py-3.5 !px-3 md:!px-4 first:!mt-4 rounded-lg transition-all duration-200 ${
              link.path === location.pathname
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <img
              src={
                link.path === location.pathname ? link.coloredIcon : link.icon
              }
              alt="icon"
              className="w-5 h-5"
            />
            <span className="max-md:hidden font-medium">{link.name}</span>
            <div
              className={`${
                link.path === location.pathname
                  ? "bg-primary"
                  : "bg-transparent"
              } w-1 h-6 rounded-full right-1 absolute transition-all duration-200`}
            ></div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
