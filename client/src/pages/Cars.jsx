import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useEffect, useState } from "react";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";
import toast from "react-hot-toast";

const Cars = () => {
  // Extract search parameters from the URL
  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const { cars, axios } = useAppContext();
  const [input, setInput] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);

  // Check if search data exists in the query parameters
  const isSearchData = pickupDate && pickupLocation && returnDate;

  // Filter cars locally based on user search input
  const applyFilter = async () => {
    if (input === "") {
      setFilteredCars(cars);
      return;
    }
    const filtered = cars.filter((car) =>
      [car.brand, car.model, car.category, car.transmission].some((field) =>
        field.toLowerCase().includes(input.toLowerCase())
      )
    );
    setFilteredCars(filtered);
  };

  // Fetch available cars based on search criteria from server
  const searchCarAvailability = async () => {
    const { data } = await axios.post("/api/bookings/check-availability", {
      location: pickupLocation,
      pickupDate,
      returnDate,
    });
    if (data.success) {
      setFilteredCars(data.availableCars);
      if (data.availableCars.length === 0) {
        toast("No Cars Available");
      }
    }
  };

  // Trigger availability search if search params are present
  useEffect(() => {
    isSearchData && searchCarAvailability();
  }, []);

  // Apply local filter when input or cars data changes
  useEffect(() => {
    cars.length > 0 && !isSearchData && applyFilter();
  }, [input, cars]);

  return (
    <div>
      {/* Search section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center !py-20 bg-light max-md:!px-4"
      >
        <Title
          title="Available Cars"
          subTitle="Browse our selection of premium vehicles available for your next adventure"
        />

        {/* Search input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center bg-white !px-4 !mt-6 max-w-140 w-full h-12 rounded-full shadow"
        >
          <img src={assets.search_icon} alt="" className="w-4.5 h-4.5 !mr-2" />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by make, model, or features"
            className="w-full h-full outline-none text-sm text-gray-500"
          />
          <img src={assets.filter_icon} alt="" className="w-4.5 h-4.5 !ml-2" />
        </motion.div>
      </motion.div>

      {/* Cars listing */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="!px-6 md:!px-16 lg:!px-24 xl:!px-32 !mt-10"
      >
        <p className="text-gray-500 xl:!px-20 max-w-7xl !mx-auto">
          Showing {filteredCars.length} Cars
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 !mt-4 xl:!px-20 max-w-7xl !mx-auto">
          {filteredCars.map((car, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Cars;
