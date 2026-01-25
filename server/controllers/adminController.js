import User from "../models/User.js";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";
import Settings from "../models/Settings.js";

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalOwners = await User.countDocuments({ role: "owner" });
    const totalCars = await Car.countDocuments({ isAvailable: true });

    // Get all valid car IDs (cars that exist and are available)
    const validCars = await Car.find({ isAvailable: true }).select("_id");
    const validCarIds = validCars.map((car) => car._id);

    // Count only bookings for existing cars
    const totalBookings = await Booking.countDocuments({
      car: { $in: validCarIds },
    });
    const confirmedBookings = await Booking.countDocuments({
      status: "confirmed",
      car: { $in: validCarIds },
    });
    const pendingBookings = await Booking.countDocuments({
      status: "pending",
      car: { $in: validCarIds },
    });
    const cancelledBookings = await Booking.countDocuments({
      status: "cancelled",
    });

    // Calculate total revenue from completed payments
    const revenue = await Booking.aggregate([
      { $match: { status: "confirmed", paymentStatus: "completed" } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const totalRevenue = revenue[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOwners,
        totalCars,
        totalBookings,
        confirmedBookings,
        pendingBookings,
        cancelledBookings,
        totalRevenue,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all owners
export const getAllOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: "owner" }).select("-password");
    res.json({ success: true, owners });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all cars
export const getAllCarsAdmin = async (req, res) => {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Find all active bookings for today
    const activeBookings = await Booking.find({
      pickupDate: { $lte: endOfToday },
      returnDate: { $gte: today },
      status: { $in: ["confirmed", "pending"] },
      paymentStatus: "completed",
    }).select("car");

    const bookedCarIds = activeBookings.map((b) => b.car.toString());

    const cars = await Car.find().populate("owner", "name email").exec();

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

// Get all bookings
export const getAllBookingsAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("car", "brand model name isAvailable")
      .populate("user", "name email")
      .populate("owner", "name email")
      .exec();

    // Filter out bookings where car was deleted or unavailable
    const validBookings = bookings.filter(
      (booking) => booking.car && booking.car.isAvailable,
    );

    res.json({ success: true, bookings: validBookings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Toggle maintenance mode
export const toggleMaintenanceMode = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    settings.maintenanceMode = !settings.maintenanceMode;
    await settings.save();

    res.json({
      success: true,
      message: `Maintenance mode ${settings.maintenanceMode ? "enabled" : "disabled"}`,
      maintenanceMode: settings.maintenanceMode,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get maintenance mode status
export const getMaintenanceModeStatus = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
      await settings.save();
    }

    res.json({ success: true, maintenanceMode: settings.maintenanceMode });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete a car
export const deleteCar = async (req, res) => {
  try {
    const { carId } = req.params;

    // Cancel all pending/confirmed bookings for this car
    await Booking.updateMany(
      { car: carId, status: { $in: ["pending", "confirmed"] } },
      { status: "cancelled" },
    );

    await Car.findByIdAndDelete(carId);
    res.json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!["confirmed", "pending", "cancelled"].includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true },
    );

    res.json({ success: true, message: "Booking status updated", booking });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Make a user admin
export const makeUserAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { isAdmin: true },
      { new: true },
    );

    res.json({
      success: true,
      message: "User promoted to admin",
      user,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Remove admin access from a user
export const removeAdminAccess = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { isAdmin: false },
      { new: true },
    );

    res.json({
      success: true,
      message: "Admin access removed",
      user,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
