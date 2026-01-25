import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Car from "../models/Car.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import imagekit from "../configs/imageKit.js";

// Utility function to generate JWT
const generateToken = (userId) => {
  const payload = userId;
  return jwt.sign(payload, process.env.JWT_SECRET);
};

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input fields
    if (!name || !email || !password || password.length < 8) {
      return res.json({ success: false, message: "Fill all the fields" });
    }

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.json({ success: false, message: "User already exist" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    // Generate token for new user
    const token = generateToken(user._id.toString());
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Authenticate and login a user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    // Generate token for authenticated user
    const token = generateToken(user._id.toString());
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get authenticated user data
export const getUserData = async (req, res) => {
  try {
    const { user } = req;
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Fetch all available cars
export const getCars = async (req, res) => {
  try {
    // Get today's date at start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get end of today
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Find all active/confirmed bookings that overlap with today
    // These cars are currently rented out and not available
    const activeBookings = await Booking.find({
      pickupDate: { $lte: endOfToday },
      returnDate: { $gte: today },
      status: { $in: ["confirmed", "pending"] },
      paymentStatus: "completed",
    }).select("car");

    // Extract car IDs from active bookings
    const bookedCarIds = activeBookings.map((booking) =>
      booking.car.toString(),
    );

    // Fetch cars that are available and not currently booked
    const cars = await Car.find({
      isAvailable: true,
      _id: { $nin: bookedCarIds },
    });

    res.json({ success: true, cars });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update user profile image
export const updateProfileImage = async (req, res) => {
  try {
    const { user } = req;
    const { image } = req.body;

    if (!image) {
      return res.json({ success: false, message: "Image URL is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { image },
      { new: true },
    ).select("-password");

    res.json({
      success: true,
      message: "Profile image updated",
      user: updatedUser,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update user name
export const updateUserName = async (req, res) => {
  try {
    const { user } = req;
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.json({ success: false, message: "Name is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { name: name.trim() },
      { new: true },
    ).select("-password");

    res.json({
      success: true,
      message: "Name updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Upload profile image from file
export const uploadProfileImage = async (req, res) => {
  try {
    const { user } = req;

    if (!req.file) {
      return res.json({ success: false, message: "No file uploaded" });
    }

    const file = req.file;
    const uploadResponse = await imagekit.upload({
      file: file.buffer,
      fileName: `profile_${user._id}_${Date.now()}`,
      folder: "/profile-images",
    });

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { image: uploadResponse.url },
      { new: true },
    ).select("-password");

    res.json({
      success: true,
      message: "Profile image uploaded successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// Get all available car locations where cars exist
export const getAvailableLocations = async (req, res) => {
  try {
    const { searchQuery } = req.query;

    // Get all unique locations from available cars
    const cars = await Car.find({ isAvailable: true }).select("location");

    // Extract unique locations
    const uniqueLocations = [
      ...new Set(cars.map((car) => car.location)),
    ].filter((loc) => loc);

    // If search query provided, filter locations
    if (searchQuery && searchQuery.trim().length > 0) {
      const filtered = uniqueLocations.filter((location) =>
        location.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      return res.json({ success: true, locations: filtered });
    }

    res.json({ success: true, locations: uniqueLocations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
