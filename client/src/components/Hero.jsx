import { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";
import LocationSearch from "./LocationSearch";

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState("");

  // Extract global state and navigation from AppContext
  const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } =
    useAppContext();

  // Handles search form submission and redirects to the cars page with query parameters
  const handleSearch = (e) => {
    e.preventDefault();

    // Validate all fields
    if (!pickupLocation || !pickupDate || !returnDate) {
      alert("Please fill in all fields");
      return;
    }

    // Validate dates
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);

    if (returned <= picked) {
      alert("Return date must be after pickup date");
      return;
    }

    navigate(
      "/cars?pickupLocation=" +
        encodeURIComponent(pickupLocation) +
        "&pickupDate=" +
        pickupDate +
        "&returnDate=" +
        returnDate,
    );
  };

  return (
    <motion.div
      // Main container with fade-in animation
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col items-center justify-center gap-4 sm:gap-8 md:gap-14 bg-light text-center !px-4 sm:!px-6 md:!px-0 !py-12 md:!py-0"
    >
      {/* Hero heading */}
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight"
      >
        Luxury Cars On Rent
      </motion.h1>

      {/* Search form */}
      <motion.form
        initial={{ scale: 0.95, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        onSubmit={handleSearch}
        className="flex flex-col gap-4 !p-4 sm:!p-6 rounded-lg md:rounded-2xl w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]"
      >
        {/* Labels row */}
        <div className="hidden md:flex gap-8 lg:gap-10">
          <label className="text-xs md:text-sm font-medium text-gray-700 w-48">
            Location
          </label>
          <label
            htmlFor="pickup-date"
            className="text-xs md:text-sm font-medium text-gray-700 w-40"
          >
            Pick-up
          </label>
          <label
            htmlFor="return-date"
            className="text-xs md:text-sm font-medium text-gray-700 w-40"
          >
            Return
          </label>
        </div>

        {/* Inputs row and button */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          {/* Location and date inputs container */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 w-full md:w-auto flex-1">
            {/* Pickup location search */}
            <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
              <label className="text-xs md:text-sm font-medium text-gray-700 md:hidden">
                Location
              </label>
              <LocationSearch
                value={pickupLocation}
                onChange={setPickupLocation}
                placeholder="Search location..."
              />
            </div>

            {/* Pickup date input */}
            <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
              <label
                htmlFor="pickup-date"
                className="text-xs md:text-sm font-medium text-gray-700 md:hidden"
              >
                Pick-up
              </label>
              <input
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                type="date"
                id="pickup-date"
                min={new Date().toISOString().split("T")[0]}
                className="w-full sm:w-auto text-xs md:text-sm text-gray-700 px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-lg md:rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Return date input */}
            <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
              <label
                htmlFor="return-date"
                className="text-xs md:text-sm font-medium text-gray-700 md:hidden"
              >
                Return
              </label>
              <input
                value={returnDate}
                min={pickupDate}
                onChange={(e) => setReturnDate(e.target.value)}
                type="date"
                id="return-date"
                className="w-full sm:w-auto text-xs md:text-sm text-gray-700 px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-lg md:rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Search button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-1 !px-6 sm:!px-9 !py-2 md:!py-2.5 bg-primary hover:bg-primary-dull text-white rounded-full w-full md:w-auto cursor-pointer text-sm md:text-base flex-shrink-0"
          >
            <img
              src={assets.search_icon}
              alt="search"
              className="brightness-300 h-4 md:h-5"
            />
            Search
          </motion.button>
        </div>

        {/* Select location text below */}
        <p className="!px-1 text-xs text-gray-500 md:hidden">
          {pickupLocation ? pickupLocation : "Select location"}
        </p>
      </motion.form>

      {/* Hero car image */}
      <motion.img
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        src={assets.main_car}
        alt="car"
        className="max-h-40 sm:max-h-56 md:max-h-72 lg:max-h-96 w-auto mt-4 md:mt-0"
      />
    </motion.div>
  );
};

export default Hero;
