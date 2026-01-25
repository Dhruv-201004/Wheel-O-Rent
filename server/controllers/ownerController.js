import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";

/** Verify if a city exists using Nominatim OpenStreetMap API */
export const verifyCityLocation = async (req, res) => {
  try {
    const { city } = req.body;

    if (!city || city.trim() === "") {
      return res.json({ success: false, message: "City name is required" });
    }

    // Use Nominatim (OpenStreetMap) free geocoding API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "WheelORent-CarRental (contact@wheelorent.com)",
        },
      },
    );

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return res.json({
        success: true,
        verified: true,
        message: "City verified",
        cityData: {
          displayName: result.display_name,
          latitude: result.lat,
          longitude: result.lon,
          type: result.type,
        },
      });
    } else {
      return res.json({
        success: true,
        verified: false,
        message:
          "City not found. Please check the spelling or try another city.",
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "Error verifying location: " + error.message,
    });
  }
};

/** Change user role to owner */
export const changeRoleToOwner = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { role: "owner" });
    res.json({ success: true, message: "Now you can list cars" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/** Add new car listing */
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    if (!imageFile) {
      return res.json({ success: false, message: "No image provided" });
    }

    // Use buffer directly from memory storage
    const uploadResponse = await imagekit.upload({
      file: imageFile.buffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    const image = imagekit.url({
      path: uploadResponse.filePath,
      transformation: [
        { width: "1280" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    await Car.create({ ...car, owner: _id, image });
    // Automatically set user role to owner when they add a car
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.json({ success: true, message: "Car Added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/** Get all cars owned by logged-in user */
export const getOwnerCars = async (req, res) => {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Find all active bookings for today
    const activeBookings = await Booking.find({
      owner: req.user._id,
      pickupDate: { $lte: endOfToday },
      returnDate: { $gte: today },
      status: { $in: ["confirmed", "pending"] },
      paymentStatus: "completed",
    }).select("car");

    const bookedCarIds = activeBookings.map((b) => b.car.toString());

    const cars = await Car.find({ owner: req.user._id });

    // Add currentlyBooked status to each car
    const carsWithStatus = cars.map((car) => ({
      ...car._doc,
      currentlyBooked: bookedCarIds.includes(car._id.toString()),
    }));

    res.json({ success: true, cars: carsWithStatus });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/** Toggle availability of a car */
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);

    if (car.owner.toString() !== _id.toString())
      return res.json({ success: false, message: "Unauthorized" });

    car.isAvailable = !car.isAvailable;
    await car.save();
    res.json({ success: true, message: "Availability Toggled" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/** Remove car from listing */
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);

    if (car.owner.toString() !== _id.toString())
      return res.json({ success: false, message: "Unauthorized" });

    // Cancel all pending/confirmed bookings for this car
    await Booking.updateMany(
      { car: carId, status: { $in: ["pending", "confirmed"] } },
      { status: "cancelled" },
    );

    car.owner = null;
    car.isAvailable = false;
    await car.save();

    res.json({ success: true, message: "Car Removed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/** Get owner dashboard statistics */
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role !== "owner")
      return res.json({ success: false, message: "Unauthorized" });

    const cars = await Car.find({ owner: _id });
    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    // Filter out bookings where car was deleted
    const validBookings = bookings.filter(
      (b) => b.car && b.car.isAvailable !== false,
    );

    const pendingBookings = validBookings.filter(
      (b) => b.status === "pending" && b.paymentStatus === "completed",
    );
    const completedBookings = validBookings.filter(
      (b) => b.status === "confirmed" && b.paymentStatus === "completed",
    );

    // Calculate revenue only from completed payments
    const monthlyRevenue = completedBookings.reduce(
      (sum, b) => sum + b.price,
      0,
    );

    res.json({
      success: true,
      dashboardData: {
        totalCars: cars.length,
        totalBookings: validBookings.filter(
          (b) => b.paymentStatus === "completed",
        ).length,
        pendingBookings: pendingBookings.length,
        completedBookings: completedBookings.length,
        recentBookings: validBookings
          .filter((b) => b.paymentStatus === "completed")
          .slice(0, 3),
        monthlyRevenue,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/** Update profile image */
export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const imageFile = req.file;

    if (!imageFile) {
      return res.json({ success: false, message: "No image provided" });
    }

    // Use buffer directly from memory storage
    const uploadResponse = await imagekit.upload({
      file: imageFile.buffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    const image = imagekit.url({
      path: uploadResponse.filePath,
      transformation: [
        { width: "400" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    await User.findByIdAndUpdate(_id, { image });
    res.json({ success: true, message: "Image Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
