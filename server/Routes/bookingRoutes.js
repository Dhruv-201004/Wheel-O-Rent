import express from "express";
import {
  changeBookingStatus,
  checkAvailabilityOfCars,
  createBooking,
  getOwnerBookings,
  getUserBookings,
  getTodayBookings,
  createPaymentIntent,
  confirmPayment,
} from "../controllers/bookingController.js";
import protect from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityOfCars);
bookingRouter.post("/create-booking", protect, createBooking);
bookingRouter.post("/create-payment-intent", protect, createPaymentIntent);
bookingRouter.post("/confirm-payment", protect, confirmPayment);
bookingRouter.get("/user", protect, getUserBookings);
bookingRouter.get("/owner", protect, getOwnerBookings);
bookingRouter.post("/change-status", protect, changeBookingStatus);
bookingRouter.get("/today-bookings", getTodayBookings);

export default bookingRouter;
