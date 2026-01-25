import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../../components/owner/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import LocationInput from "../../components/owner/LocationInput";

const AddCar = () => {
  const navigate = useNavigate();
  const { axios, currency } = useAppContext();
  const [image, setImage] = useState(null);
  const locationInputRef = useRef(null);
  const [car, setCar] = useState({
    // Stores car details
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: "",
    location: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Handles car form submission
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    // Validate location
    if (!car.location || car.location.trim() === "") {
      toast.error("Please select a valid city from suggestions");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("carData", JSON.stringify(car));

      const { data } = await axios.post("/api/owner/add-car", formData);
      if (data.success) {
        toast.success(data.message);
        setImage(null);
        setCar({
          brand: "",
          model: "",
          year: "",
          pricePerDay: "",
          category: "",
          transmission: "",
          fuel_type: "",
          seating_capacity: "",
          location: "",
          description: "",
        });
        navigate("/owner/manage-cars");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="!px-4 !py-4 md:!px-8 flex-1 bg-gray-50/50">
      {/* Car Listing Form */}
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-4 text-gray-600 text-sm max-w-4xl bg-white !p-5 rounded-xl border border-borderColor shadow-sm"
      >
        {/* Header with Image Upload */}
        <div className="flex items-center justify-between gap-4 !pb-3 border-b border-gray-100">
          <div>
            <h1 className="font-semibold text-xl text-gray-800">Add New Car</h1>
            <p className="text-xs text-gray-500 !mt-0.5">
              Fill in details to list your car
            </p>
          </div>
          <div className="flex items-center gap-3 !p-3 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <label
              htmlFor="car-image"
              className="cursor-pointer flex items-center gap-3"
            >
              <img
                src={image ? URL.createObjectURL(image) : assets.upload_icon}
                alt=""
                className={`${image ? "h-12 w-12 object-cover rounded-lg" : "h-10"}`}
              />
              <div>
                <p className="text-xs font-medium text-gray-700">
                  Upload Photo
                </p>
                <p className="text-xs text-gray-400">PNG, JPG</p>
              </div>
              <input
                type="file"
                id="car-image"
                accept="image/*"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {/* Row 1: Brand, Model, Year, Price */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 !mb-1">
              Brand <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="BMW, Mercedes..."
              required
              className="!px-3 !py-2 text-sm border border-borderColor rounded-lg outline-none focus:border-primary transition-all"
              value={car.brand}
              onChange={(e) => setCar({ ...car, brand: e.target.value })}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 !mb-1">
              Model <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="X5, E-Class..."
              required
              className="!px-3 !py-2 text-sm border border-borderColor rounded-lg outline-none focus:border-primary transition-all"
              value={car.model}
              onChange={(e) => setCar({ ...car, model: e.target.value })}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 !mb-1">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder={`${new Date().getFullYear()}`}
              required
              min={1900}
              className="!px-3 !py-2 text-sm border border-borderColor rounded-lg outline-none focus:border-primary transition-all"
              value={car.year}
              onChange={(e) => setCar({ ...car, year: e.target.value })}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 !mb-1">
              Price/Day ({currency}) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="100"
              required
              min={1}
              className="!px-3 !py-2 text-sm border border-borderColor rounded-lg outline-none focus:border-primary transition-all"
              value={car.pricePerDay}
              onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
            />
          </div>
        </div>

        {/* Row 2: Category, Transmission, Fuel, Seats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 !mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              onChange={(e) => setCar({ ...car, category: e.target.value })}
              value={car.category}
              required
              className="!px-3 !py-2 text-sm border border-borderColor rounded-lg outline-none focus:border-primary transition-all bg-white"
            >
              <option value="">Select</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Coupe">Coupe</option>
              <option value="Convertible">Convertible</option>
              <option value="Van">Van</option>
              <option value="Pickup Truck">Pickup</option>
              <option value="Sports Car">Sports</option>
              <option value="Luxury">Luxury</option>
              <option value="Electric">Electric</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 !mb-1">
              Transmission <span className="text-red-500">*</span>
            </label>
            <select
              onChange={(e) => setCar({ ...car, transmission: e.target.value })}
              value={car.transmission}
              required
              className="!px-3 !py-2 text-sm border border-borderColor rounded-lg outline-none focus:border-primary transition-all bg-white"
            >
              <option value="">Select</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automic">Semi-Auto</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 !mb-1">
              Fuel Type <span className="text-red-500">*</span>
            </label>
            <select
              onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
              value={car.fuel_type}
              required
              className="!px-3 !py-2 text-sm border border-borderColor rounded-lg outline-none focus:border-primary transition-all bg-white"
            >
              <option value="">Select</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="Electric">Electric</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 !mb-1">
              Seats <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="4"
              required
              min={1}
              className="!px-3 !py-2 text-sm border border-borderColor rounded-lg outline-none focus:border-primary transition-all"
              value={car.seating_capacity}
              onChange={(e) =>
                setCar({ ...car, seating_capacity: e.target.value })
              }
            />
          </div>
        </div>

        {/* Row 3: Location and Description side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <LocationInput
              ref={locationInputRef}
              value={car.location}
              onChange={(value) => setCar({ ...car, location: value })}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 !mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              className="!px-3 !py-2 text-sm border border-borderColor rounded-lg outline-none focus:border-primary transition-all resize-none"
              placeholder="Brief description of your car..."
              value={car.description}
              onChange={(e) => setCar({ ...car, description: e.target.value })}
            />
          </div>
        </div>

        {/* Footer with note and button */}
        <div className="flex items-center justify-between !pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            <span className="text-red-500">*</span> Required fields
          </p>
          <button className="flex items-center gap-2 !px-6 !py-2.5 bg-primary hover:bg-primary-dull text-white rounded-lg font-semibold cursor-pointer transition-colors shadow-sm">
            <img src={assets.tick_icon} alt="" className="w-4 h-4" />
            {isLoading ? "Listing..." : "List Car"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCar;
