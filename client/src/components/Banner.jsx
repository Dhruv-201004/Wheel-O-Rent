import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

// Promotional banner for car owners
const Banner = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const handleListCar = () => {
    if (token) {
      navigate("/owner");
    } else {
      toast.error("Please LogIn first");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row md:items-center justify-between !px-6 sm:!px-8 md:!px-12 lg:!px-16 !py-8 md:!py-12 bg-gradient-to-r from-[#0558FE] to-[#A9CFFF] rounded-lg md:rounded-2xl overflow-hidden w-full md:max-w-5xl lg:max-w-6xl !mx-auto"
    >
      {/* Banner text content */}
      <div className="text-white">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          Do You Own a Luxury Car?
        </h2>
        <p className="!mt-1 sm:!mt-2 text-sm md:text-base leading-relaxed">
          Monetize your vehicle effortlessly by listing it on CarRental.
        </p>
        <p className="max-w-130">
          We take care of insurance, driver verification, and secure payments –
          so you can earn passive income, stress-free.
        </p>

        {/* Call-to-action button */}
        <motion.button
          onClick={handleListCar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="!px-4 sm:!px-6 !py-2 bg-white hover:bg-slate-100 transition-all text-primary rounded-lg text-xs sm:text-sm !mt-3 md:!mt-4 cursor-pointer"
        >
          List Your Car
        </motion.button>
      </div>

      {/* Banner image */}
      <motion.img
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        src={assets.banner_car_image}
        alt="car"
        className="max-h-32 sm:max-h-40 md:max-h-48 lg:max-h-56 !mt-6 md:!mt-0 w-auto"
      />
    </motion.div>
  );
};

export default Banner;
