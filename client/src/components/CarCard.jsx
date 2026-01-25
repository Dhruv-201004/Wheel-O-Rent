import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

// Card component to display car details
const CarCard = ({ car, isOwnCar = false }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isOwnCar) {
      navigate(`/car-details/${car._id}`);
      scrollTo(0, 0);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group rounded-xl overflow-hidden shadow-lg 
                 transition-all duration-500 ${
                   isOwnCar
                     ? "opacity-60 cursor-not-allowed"
                     : "hover:-translate-y-1 cursor-pointer"
                 }`}
    >
      {/* Car image and availability badge */}
      <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden">
        <img
          src={car.image}
          alt="Car"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isOwnCar && (
          <p className="absolute top-2 sm:top-3 left-2 sm:left-4 bg-yellow-500/90 !px-2 sm:!px-2.5 !py-0.5 sm:!py-1 rounded-full text-xs text-white font-medium">
            Your Car
          </p>
        )}
        {!isOwnCar && car.isAvailable && (
          <p className="absolute top-2 sm:top-3 left-2 sm:left-4 bg-primary/90 !px-2 sm:!px-2.5 !py-0.5 sm:!py-1 rounded-full text-xs text-white">
            Available Now
          </p>
        )}
        {/* Price per day */}
        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-4 bg-black/80 backdrop-blur-sm text-white !px-2 sm:!px-3 !py-1 sm:!py-2 rounded-lg">
          <span className="text-sm sm:text-base font-semibold">
            {currency}
            {car.pricePerDay}
          </span>
          <span className="text-xs text-white/80">/ day</span>
        </div>
      </div>

      {/* Car details */}
      <div className="!p-3 sm:!p-4 md:!p-5">
        <div className="flex items-start justify-between !mb-1 sm:!mb-2">
          <div>
            <h3 className="text-base sm:text-lg font-medium leading-tight">
              {car.brand} {car.model}
            </h3>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {car.category} &bull; {car.year}
            </p>
          </div>
        </div>

        {/* Specifications */}
        <div className="!mt-3 grid grid-cols-2 gap-2 sm:gap-3 md:gap-2 text-gray-600 text-xs md:text-sm">
          <div className="flex items-center text-xs md:text-sm text-muted-foreground gap-1 md:gap-2">
            <img
              src={assets.users_icon}
              alt=""
              className="h-3 md:h-4 flex-shrink-0"
            />
            <span className="truncate">{car.seating_capacity} Seats</span>
          </div>
          <div className="flex items-center text-xs md:text-sm text-muted-foreground gap-1 md:gap-2">
            <img
              src={assets.fuel_icon}
              alt=""
              className="h-3 md:h-4 flex-shrink-0"
            />
            <span className="truncate">{car.fuel_type}</span>
          </div>
          <div className="flex items-center text-xs md:text-sm text-muted-foreground gap-1 md:gap-2">
            <img
              src={assets.car_icon}
              alt=""
              className="h-3 md:h-4 flex-shrink-0"
            />
            <span className="truncate">{car.transmission}</span>
          </div>
          <div className="flex items-center text-xs md:text-sm text-muted-foreground gap-1 md:gap-2">
            <img
              src={assets.location_icon}
              alt=""
              className="h-3 md:h-4 flex-shrink-0"
            />
            <span className="truncate">{car.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
