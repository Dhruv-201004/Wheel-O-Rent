import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  getDashboardStats,
  getAllUsers,
  getAllOwners,
  getAllCarsAdmin,
  getAllBookingsAdmin,
  toggleMaintenanceMode,
  getMaintenanceModeStatus,
  deleteUser,
  deleteCar,
  updateBookingStatus,
  makeUserAdmin,
  removeAdminAccess,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// Dashboard statistics
adminRouter.get("/stats", adminAuth, getDashboardStats);

// Maintenance mode
adminRouter.get("/maintenance-status", adminAuth, getMaintenanceModeStatus);
adminRouter.post("/maintenance-toggle", adminAuth, toggleMaintenanceMode);

// Users management
adminRouter.get("/users", adminAuth, getAllUsers);
adminRouter.get("/owners", adminAuth, getAllOwners);
adminRouter.delete("/users/:userId", adminAuth, deleteUser);
adminRouter.post("/users/:userId/make-admin", adminAuth, makeUserAdmin);
adminRouter.post("/users/:userId/remove-admin", adminAuth, removeAdminAccess);

// Cars management
adminRouter.get("/cars", adminAuth, getAllCarsAdmin);
adminRouter.delete("/cars/:carId", adminAuth, deleteCar);

// Bookings management
adminRouter.get("/bookings", adminAuth, getAllBookingsAdmin);
adminRouter.put("/bookings/:bookingId/status", adminAuth, updateBookingStatus);

export default adminRouter;
