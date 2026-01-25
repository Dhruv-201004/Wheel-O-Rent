import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

// Navbar for the Owner dashboard
const NavbarOwner = () => {
  const { user } = useAppContext(); 

  return (
    <div
      className="flex justify-between items-center !px-6
                        md:!px-10 !py-4 text-gray-500 border-b border-borderColor
                        relative transition-all"
    >
      {/* Logo linking to homepage */}
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="h-7" />
      </Link>

      {/* Welcome message */}
      <p>Welcome, {user?.name || "Owner"}</p>
    </div>
  );
};

export default NavbarOwner;
