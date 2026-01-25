import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useEffect, useState } from "react";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import LocationSearch from "../components/LocationSearch";

const Cars = () => {
  // Extract search parameters from the URL
  const [searchParams] = useSearchParams();
  let pickupLocation = searchParams.get("pickupLocation");
  let pickupDate = searchParams.get("pickupDate");
  let returnDate = searchParams.get("returnDate");

  const { cars, axios, user } = useAppContext();
  const [input, setInput] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterPickupLocation, setFilterPickupLocation] = useState(
    pickupLocation || "",
  );
  const [filterPickupDate, setFilterPickupDate] = useState(pickupDate || "");
  const [filterReturnDate, setFilterReturnDate] = useState(returnDate || "");
  const [isLoading, setIsLoading] = useState(true);

  // Check if search data exists in the query parameters
  const isSearchData = pickupDate && pickupLocation && returnDate;

  // Fetch all cars from API
  const fetchAllCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars-public");
      if (data.success) {
        setFilteredCars(data.cars);
      }
    } catch (error) {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  };

  // Filter cars locally based on user search input
  const applyFilter = () => {
    if (input === "") {
      setFilteredCars(cars.length > 0 ? cars : filteredCars);
      return;
    }
    const carsToFilter = cars.length > 0 ? cars : filteredCars;
    const filtered = carsToFilter.filter((car) =>
      [car.brand, car.model, car.category, car.transmission].some((field) =>
        field.toLowerCase().includes(input.toLowerCase()),
      ),
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
        toast.error("No Cars Available", {
          duration: 2000,
        });
      }
    }
  };

  // Handle filter modal submission
  const handleApplyFilter = async () => {
    if (!filterPickupLocation || !filterPickupDate || !filterReturnDate) {
      toast.error("Please fill all filter fields");
      return;
    }

    // Validate dates
    const picked = new Date(filterPickupDate);
    const returned = new Date(filterReturnDate);

    if (isNaN(picked) || isNaN(returned)) {
      toast.error("Invalid date format");
      return;
    }

    if (returned <= picked) {
      toast.error("Return date must be after pickup date");
      return;
    }

    pickupLocation = filterPickupLocation;
    pickupDate = filterPickupDate;
    returnDate = filterReturnDate;

    const { data } = await axios.post("/api/bookings/check-availability", {
      location: pickupLocation,
      pickupDate,
      returnDate,
    });
    if (data.success) {
      setFilteredCars(data.availableCars);
      if (data.availableCars.length === 0) {
        toast.error("No Cars Available", {
          duration: 2000,
        });
      }
    }
    setShowFilterModal(false);
  };

  // Handle clear filters
  const handleClearFilters = async () => {
    setFilterPickupLocation("");
    setFilterPickupDate("");
    setFilterReturnDate("");
    setInput("");

    // Always fetch fresh available cars
    await fetchAllCars();

    setShowFilterModal(false);
  };

  // Initialize and sync filteredCars with all cars
  useEffect(() => {
    setIsLoading(true);
    const hasSearchParams = pickupDate && pickupLocation && returnDate;

    if (hasSearchParams) {
      // If there are search params, fetch available cars
      searchCarAvailability();
    } else {
      // Filter out cars booked for today when no search params
      const filterCarsForToday = async () => {
        try {
          const { data } = await axios.get("/api/bookings/today-bookings");
          const todayBookedCarIds = data.success
            ? data.bookings.map((booking) => booking.car)
            : [];

          const carsToShow = cars.length > 0 ? cars : filteredCars;
          const availableCars = carsToShow.filter(
            (car) => !todayBookedCarIds.includes(car._id),
          );

          setFilteredCars(availableCars);
          setIsLoading(false);
        } catch (error) {
          setFilteredCars(cars.length > 0 ? cars : filteredCars);
          setIsLoading(false);
        }
      };

      if (cars.length > 0 || filteredCars.length > 0) {
        filterCarsForToday();
      } else {
        // Fetch cars from API if not available in context
        fetchAllCars();
      }
    }
  }, [pickupDate, pickupLocation, returnDate, cars, axios]);

  // Apply local search filter when input changes
  useEffect(() => {
    if (input === "") {
      // If search is cleared, show all cars
      const hasSearchParams = pickupDate && pickupLocation && returnDate;
      if (!hasSearchParams) {
        setFilteredCars(cars.length > 0 ? cars : filteredCars);
      }
    } else {
      // Apply search filter
      applyFilter();
    }
  }, [input]);

  return (
    <div>
      {/* Search section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center !py-6 sm:!py-8 md:!py-10 bg-light !px-4 sm:!px-6 md:!px-8"
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
          className="flex items-center bg-white !px-3 sm:!px-4 !mt-4 sm:!mt-6 w-full sm:max-w-2xl md:max-w-2xl lg:max-w-3xl h-10 sm:h-12 rounded-full shadow"
        >
          <img src={assets.search_icon} alt="" className="w-4.5 h-4.5 !mr-2" />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by make, model, or features"
            className="w-full h-full outline-none text-sm text-gray-500"
          />
          <button
            type="button"
            onClick={() => setShowFilterModal(true)}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img
              src={assets.filter_icon}
              alt="filter"
              className="w-4.5 h-4.5 !ml-2"
            />
          </button>
        </motion.div>
      </motion.div>

      {/* Filter Modal */}
      {showFilterModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 !p-4 max-md:!p-2"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg w-full sm:max-w-md !p-4 sm:!p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between !mb-3 sm:!mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">
                Modify Filters
              </h2>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <img src={assets.close_icon} alt="close" className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Pickup Location */}
              <div>
                <label className="block text-sm font-medium !mb-2">
                  Pickup Location
                </label>
                <LocationSearch
                  value={filterPickupLocation}
                  onChange={setFilterPickupLocation}
                  placeholder="Search location..."
                />
              </div>

              {/* Pickup Date */}
              <div>
                <label className="block text-sm font-medium !mb-2">
                  Pickup Date
                </label>
                <input
                  type="date"
                  value={filterPickupDate}
                  onChange={(e) => setFilterPickupDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full !p-2 border rounded-md outline-none focus:border-primary text-sm"
                  required
                />
              </div>

              {/* Return Date */}
              <div>
                <label className="block text-sm font-medium !mb-2">
                  Drop-off Date
                </label>
                <input
                  type="date"
                  value={filterReturnDate}
                  onChange={(e) => setFilterReturnDate(e.target.value)}
                  min={filterPickupDate}
                  className="w-full !p-2 border rounded-md outline-none focus:border-primary text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 !mt-4 sm:!mt-6">
              <button
                onClick={handleClearFilters}
                className="flex-1 !px-3 sm:!px-4 !py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleApplyFilter}
                className="flex-1 !px-3 sm:!px-4 !py-2 text-sm bg-primary text-white rounded-md hover:bg-primary-dull transition-colors"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Cars listing */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="!px-4 sm:!px-6 md:!px-8 lg:!px-16 xl:!px-24 2xl:!px-32 !mt-6 sm:!mt-8 md:!mt-10"
      >
        <p className="text-sm md:text-base text-gray-500 max-w-7xl !mx-auto">
          Showing {filteredCars.length} Cars
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 !mt-4 md:!mt-6 max-w-7xl !mx-auto">
          {filteredCars.map((car, index) => {
            const isOwnCar = user && user._id === car.owner;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <CarCard car={car} isOwnCar={isOwnCar} />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Cars;
