import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const MyBooking = () => {
  const { axios, currency, user } = useAppContext();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetches all bookings for the logged-in user
  const fetchMyBookings = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/bookings/user");
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger bookings fetch when user data is available
  useEffect(() => {
    user && fetchMyBookings();
  }, [user]);

  // Filter bookings based on status
  const filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

  // Calculate statistics
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center !py-10 bg-light max-md:!px-4"
      >
        <Title
          title={"My Bookings"}
          subTitle={"View and manage all your car bookings"}
          align={"center"}
        />
      </motion.div>

      <div className="!px-6 md:!px-16 lg:!px-24 xl:!px-32 2xl:!px-48 text-sm max-w-7xl !mx-auto">
        {/* Statistics Cards */}
        {!isLoading && bookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 !mt-8 !mb-8"
          >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 !p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Total Bookings</p>
              <h3 className="text-3xl font-bold text-primary !mt-2">
                {stats.total}
              </h3>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 !p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Confirmed</p>
              <h3 className="text-3xl font-bold text-green-600 !mt-2">
                {stats.confirmed}
              </h3>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 !p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Pending</p>
              <h3 className="text-3xl font-bold text-yellow-600 !mt-2">
                {stats.pending}
              </h3>
            </div>
          </motion.div>
        )}

        {/* Filter Buttons */}
        {!isLoading && bookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex gap-3 !mb-8 flex-wrap"
          >
            {[
              { label: "All", value: "all" },
              { label: "Confirmed", value: "confirmed" },
              { label: "Pending", value: "pending" },
            ].map((filter) => (
              <motion.button
                key={filter.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterStatus(filter.value)}
                className={`!px-4 !py-2 rounded-lg font-medium transition-all cursor-pointer ${
                  filterStatus === filter.value
                    ? "bg-primary text-white shadow-lg"
                    : "bg-light text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </motion.button>
            ))}
          </motion.div>
        )}

        <div>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center !py-20"
            >
              <div className="w-12 h-12 border-4 border-light border-t-primary rounded-full animate-spin"></div>
              <p className="text-gray-500 !mt-4">Loading your bookings...</p>
            </motion.div>
          ) : bookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center !py-20 text-center"
            >
              <img
                src={assets.car_icon}
                alt="No bookings"
                className="w-20 h-20 opacity-30 !mb-6"
              />
              <h2 className="text-2xl font-semibold text-gray-800 !mb-3">
                No Bookings Yet
              </h2>
              <p className="text-gray-500 max-w-md !mb-8">
                You haven't made any bookings yet. Plan your next trip and book
                your perfect car now!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  navigate("/cars");
                  scrollTo(0, 0);
                }}
                className="!px-8 !py-3 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg font-medium cursor-pointer"
              >
                Explore Cars
              </motion.button>
            </motion.div>
          ) : (
            <motion.div layout className="space-y-6">
              {filteredBookings.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center justify-center !py-16 text-center"
                >
                  <img
                    src={assets.car_icon}
                    alt="No bookings"
                    className="w-16 h-16 opacity-30 !mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-700">
                    No {filterStatus !== "all" ? filterStatus : ""} bookings
                  </h3>
                  <p className="text-gray-500 text-sm !mt-2">
                    Try changing the filter or explore more cars
                  </p>
                </motion.div>
              ) : (
                filteredBookings.map((booking, index) => {
                  const pickupDate = new Date(booking.pickupDate);
                  const returnDate = new Date(booking.returnDate);
                  const days = Math.ceil(
                    (returnDate - pickupDate) / (1000 * 60 * 60 * 24),
                  );
                  const isUpcoming = pickupDate > new Date();

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      key={booking._id}
                      className={`rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border-l-4 ${
                        isUpcoming ? "border-l-blue-500" : "border-l-gray-400"
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 !p-6 bg-white">
                        {/* Car image and basic info */}
                        <div className="md:col-span-1">
                          <div className="rounded-md overflow-hidden !mb-3 relative">
                            <img
                              src={booking.car.image}
                              alt="Car"
                              className="w-full h-auto aspect-video object-cover hover:scale-105 transition-transform duration-300"
                            />
                            {isUpcoming && (
                              <div className="absolute top-2 right-2 bg-blue-500 text-white !px-2 !py-1 rounded text-xs font-semibold">
                                Upcoming
                              </div>
                            )}
                          </div>
                          <p className="text-lg font-medium !mt-2">
                            {booking.car.brand} {booking.car.model}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {booking.car.year} &bull; {booking.car.category}
                          </p>
                        </div>

                        {/* Booking details */}
                        <div className="md:col-span-2 space-y-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            <p className="!px-3 !py-1.5 bg-light rounded font-medium text-sm">
                              Booking #{index + 1}
                            </p>
                            <p
                              className={`!px-3 !py-1 text-xs rounded-full font-semibold ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : booking.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {booking.status === "pending"
                                ? "AWAITING CONFIRMATION"
                                : booking.status.toUpperCase()}
                            </p>
                            <span className="text-xs font-medium text-gray-600 bg-gray-100 !px-2 !py-1 rounded">
                              {days} days
                            </span>
                          </div>

                          {/* Status Message for Pending */}
                          {booking.status === "pending" && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md !p-3">
                              <p className="text-sm text-yellow-700">
                                ⏳ The owner is reviewing your booking. You'll
                                receive a full refund if cancelled.
                              </p>
                            </div>
                          )}

                          {/* Rental period */}
                          <div className="flex items-start gap-2">
                            <img
                              src={assets.calendar_icon_colored}
                              alt=""
                              className="w-5 h-5 !mt-0.5 flex-shrink-0"
                            />
                            <div>
                              <p className="text-gray-600 text-sm font-medium">
                                Rental Period
                              </p>
                              <p className="text-gray-800 font-semibold">
                                {booking.pickupDate.split("T")[0]} to{" "}
                                {booking.returnDate.split("T")[0]}
                              </p>
                            </div>
                          </div>

                          {/* Pickup location */}
                          <div className="flex items-start gap-2">
                            <img
                              src={assets.location_icon_colored}
                              alt=""
                              className="w-5 h-5 !mt-0.5 flex-shrink-0"
                            />
                            <div>
                              <p className="text-gray-600 text-sm font-medium">
                                Pick-up Location
                              </p>
                              <p className="text-gray-800 font-semibold">
                                {booking.car.location}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Price and booking date */}
                        <div className="md:col-span-1 flex flex-col justify-between">
                          <div className="text-right">
                            <p className="text-gray-600 text-sm">Total Price</p>
                            <h1 className="text-3xl font-bold text-primary !mt-1">
                              {currency}
                              {booking.price}
                            </h1>
                            <p className="text-gray-500 text-xs !mt-2">
                              Booked on {booking.createdAt.split("T")[0]}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MyBooking;
