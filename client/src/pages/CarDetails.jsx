import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const CarDetails = () => {
  const { id } = useParams();
  const {
    cars,
    currency,
    axios,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  } = useAppContext();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);

  // Handle booking submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/bookings/create-booking", {
        car: id,
        pickupDate,
        returnDate,
      });
      data.success
        ? (toast.success(data.message), navigate("/my-bookings"))
        : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch selected car details
  useEffect(() => {
    setCar(cars.find((car) => car._id === id));
  }, [cars, id]);

  return car ? (
    <div className="!px-16 md:!px-16 lg:!px-24 xl:!px-32 !mt-16 ">
      {/* Back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 !mb-6 text-gray-500 cursor-pointer"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-65" />
        Back to All Cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Car details section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2"
        >
          {/* Car image */}
          <motion.img
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={car.image}
            alt=""
            className="w-full h-auto md:max-h-100 object-cover rounded-xl !mb-6 shadow-md"
          />

          {/* Car information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold">
                {car.brand} {car.model}
              </h1>
              <p className="text-gray-500 text-lg">
                {car.category} &bull; {car.year}
              </p>
            </div>
            <hr className="border border-borderColor !my-6" />

            {/* Car specifications */}
            <div className="grid grid-cols-2 sma:grid-cols-4 gap-4">
              {[
                {
                  icon: assets.users_icon,
                  text: `${car.seating_capacity} Seats`,
                },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  key={text}
                  className="flex flex-col items-center bg-light !p-4 rounded-lg"
                >
                  <img src={icon} alt="" className="!mb-2 h-5" />
                  {text}
                </motion.div>
              ))}
            </div>

            {/* Car description */}
            <div className="!my-2">
              <h1 className="text-xl font-medium !mb-3">Description</h1>
              <p className="text-gray-500">{car.description}</p>
            </div>

            {/* Car features */}
            <div>
              <h1 className="text-xl font-medium !mb-3">Features</h1>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "360 Camera",
                  "Bluetooth",
                  "Navigation System",
                  "Sunroof",
                ].map((item) => (
                  <li key={item} className="flex items-center text-gray-500">
                    <img src={assets.check_icon} className="!mr-2 h-4" alt="" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Booking form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="shadow-lg h-max sticky top-18 rounded-xl !p-6 space-y-6 text-gray-500"
        >
          {/* Price display */}
          <p className="flex items-center justify-between text-2xl text-gray-800 font-semibold">
            {currency}
            {car.pricePerDay}
            <span className="text-base text-gray-400 font-normal">per day</span>
          </p>
          <hr className="border-borderColor !my-6" />

          {/* Pickup date */}
          <div className="flex flex-col gap-2">
            <label htmlFor="pickup_date">Pickup Date</label>
            <input
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              type="date"
              className="border border-borderColor !px-3 !py-2 rounded-lg"
              required
              id="pickup_date"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Return date */}
          <div className="flex flex-col gap-2 !my-1">
            <label htmlFor="return_date">Return Date</label>
            <input
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              type="date"
              className="border border-borderColor !px-3 !py-2 rounded-lg"
              required
              id="return_date"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Submit button */}
          <button className="!my-2 w-full bg-primary hover:bg-primary-dull transition-all font-medium text-white !py-3 rounded-xl cursor-pointer">
            Book Now
          </button>
          <p className="text-sm text-center">
            No credit card required to reserve
          </p>
        </motion.form>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default CarDetails;
