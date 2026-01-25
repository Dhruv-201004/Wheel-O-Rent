import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Title from "./Title";
import CarCard from "./CarCard";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

// Section showcasing featured cars
const FeaturedSection = () => {
  const navigate = useNavigate();
  const { cars, user, axios } = useAppContext();
  const [filteredCars, setFilteredCars] = useState([]);
  const [allCars, setAllCars] = useState([]);

  // Fetch all public cars
  useEffect(() => {
    const fetchPublicCars = async () => {
      try {
        const { data } = await axios.get("/api/user/cars-public");
        if (data.success) {
          setAllCars(data.cars);
        }
      } catch (error) {
        // Fallback to context cars
        setAllCars(cars);
      }
    };

    // Use cars from context if available, otherwise fetch from API
    if (cars.length > 0) {
      setAllCars(cars);
    } else {
      fetchPublicCars();
    }
  }, [cars, axios]);

  // Filter out booked cars for today (but keep owner's cars)
  useEffect(() => {
    const filterFeaturedCars = async () => {
      try {
        // Fetch bookings for today
        const { data } = await axios.get("/api/bookings/today-bookings");
        const todayBookedCarIds = data.success
          ? data.bookings.map((booking) => booking.car)
          : [];

        // Filter cars - exclude only booked cars for today
        const filtered = allCars.filter((car) => {
          // Don't show booked cars for today
          if (todayBookedCarIds.includes(car._id)) {
            return false;
          }
          return true;
        });

        setFilteredCars(filtered.slice(0, 6));
      } catch (error) {
        // Fallback: show all cars
        setFilteredCars(allCars.slice(0, 6));
      }
    };

    if (allCars.length > 0) {
      filterFeaturedCars();
    }
  }, [allCars, axios]);

  return (
    <motion.div
      className="flex flex-col items-center  !py-24 !px-6 md:!px-16
                 lg:!px-24 xl:!px-32"
    >
      {/* Section heading */}
      <motion.div>
        <Title
          title="Featured Cars"
          subTitle="Explore our selection of premium vehicles available for your next adventure."
          align="center"
        />
      </motion.div>

      {/* Featured cars grid */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 !mt-18">
        {filteredCars.map((car) => {
          const isOwnCar = user && user._id === car.owner;
          return (
            <motion.div key={car._id}>
              <CarCard car={car} isOwnCar={isOwnCar} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* View all cars button */}
      <motion.button
        onClick={() => {
          navigate("/cars");
          scrollTo(0, 0);
        }}
        className="flex items-center justify-center gap-2 !px-6 !py-2
                   border border-borderColor hover:bg-gray-50 rounded-md !mt-18 cursor-pointer"
      >
        Explore All Cars <img src={assets.arrow_icon} alt="arrow" />
      </motion.button>
    </motion.div>
  );
};

export default FeaturedSection;
