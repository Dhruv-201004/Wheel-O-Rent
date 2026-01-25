import { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageCars = () => {
  const { isOwner, axios, currency } = useAppContext();
  const [cars, setCars] = useState([]);

  // Fetch all cars owned by the logged-in owner
  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get("/api/owner/cars");
      data.success ? setCars(data.cars) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Toggle car availability status
  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post("/api/owner/toggle-car", { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete a car after confirmation
  const deleteCar = async (carId) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this car?",
      );
      if (!confirm) return;
      const { data } = await axios.post("/api/owner/delete-car", { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch cars when component mounts and owner is authenticated
  useEffect(() => {
    isOwner && fetchOwnerCars();
  }, [isOwner]);

  return (
    <div className="!px-4 !py-8 md:!px-10 w-full bg-gray-50/50">
      <Title
        title="Manage Cars"
        subTitle="View all listed cars, update their details or remove them from the booking platform."
      />

      <div className="w-full rounded-xl overflow-hidden border border-borderColor !mt-8 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500 bg-gray-50">
            <tr>
              <th className="!p-4 font-semibold text-center">Car</th>
              <th className="!p-4 font-semibold text-center max-md:hidden">
                Category
              </th>
              <th className="!p-4 font-semibold text-center">Price</th>
              <th className="!p-4 font-semibold text-center max-md:hidden">
                Status
              </th>
              <th className="!p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {cars.length > 0 ? (
              cars.map((cars, index) => (
                <tr
                  key={index}
                  className="border-t border-borderColor hover:bg-gray-50/50 transition-colors"
                >
                  <td className="!p-4">
                    <div className="flex items-center justify-center gap-4">
                      <img
                        src={cars.image}
                        alt=""
                        className="h-14 w-14 aspect-square rounded-lg object-cover shadow-sm"
                      />
                      <div className="max-md:hidden">
                        <p className="font-medium text-gray-800 text-base">
                          {cars.brand} {cars.model}
                        </p>
                        <p className="text-sm text-gray-500 !mt-0.5">
                          {cars.seating_capacity} seats &bull;{" "}
                          {cars.transmission}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="!p-4 max-md:hidden text-center">
                    <span className="!px-3 !py-1.5 bg-gray-100 rounded-full text-sm font-medium">
                      {cars.category}
                    </span>
                  </td>
                  <td className="!p-4 font-semibold text-gray-800 text-center text-base">
                    {currency}
                    {cars.pricePerDay}
                  </td>

                  <td className="!p-4 max-md:hidden text-center">
                    <span
                      className={`!px-3 !py-1.5 rounded-full text-xs font-medium ${
                        cars.currentlyBooked
                          ? "bg-orange-100 text-orange-600"
                          : cars.isAvailable
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                      }`}
                    >
                      {cars.currentlyBooked
                        ? "Booked"
                        : cars.isAvailable
                          ? "Available"
                          : "Unavailable"}
                    </span>
                  </td>

                  <td className="!p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => toggleAvailability(cars._id)}
                        className="!p-2.5 rounded-lg hover:bg-gray-100 transition-colors "
                        title={cars.isAvailable ? "Hide car" : "Show car"}
                      >
                        <img
                          src={
                            cars.isAvailable
                              ? assets.eye_close_icon
                              : assets.eye_icon
                          }
                          alt=""
                          className="w-10 h-10"
                        />
                      </button>
                      <button
                        onClick={() => deleteCar(cars._id)}
                        className="!p-2.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete car"
                      >
                        <img
                          src={assets.delete_icon}
                          alt=""
                          className="w-10 h-10"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="!p-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center !mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">
                      No cars listed yet
                    </p>
                    <p className="text-gray-400 text-sm !mt-1">
                      Add your first car to start receiving bookings
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCars;
