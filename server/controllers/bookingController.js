import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SEC_KEY);

/** Check if a car is available for a given date range */
export const checkAvailability = async (car, pickupDate, returnDate) => {
  const bookings = await Booking.find({
    car,
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate },
  });
  return bookings.length === 0;
};

/** Get available cars for a location and date range */
export const checkAvailabilityOfCars = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;
    if (!location || !pickupDate || !returnDate) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const cars = await Car.find({ location, isAvailable: true });
    const availableCarsPromises = cars.map(async (car) => {
      const isAvailable = await checkAvailability(
        car._id,
        pickupDate,
        returnDate,
      );
      return { ...car._doc, isAvailable };
    });

    let availableCars = await Promise.all(availableCarsPromises);
    availableCars = availableCars.filter((car) => car.isAvailable);

    res.json({ success: true, availableCars });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/** Create a new booking */
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    if (!(await checkAvailability(car, pickupDate, returnDate))) {
      return res.json({ success: false, message: "Car Not Available" });
    }

    const carData = await Car.findById(car);
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const days = Math.max(
      Math.ceil((returned - picked) / (1000 * 60 * 60 * 24)),
      1,
    );
    const price = days * carData.pricePerDay;

    await Booking.create({
      car,
      user: _id,
      owner: carData.owner,
      pickupDate,
      returnDate,
      price,
    });

    res.json({ success: true, message: "Booking Created" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/** Get bookings of the logged-in user */
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
      paymentStatus: "completed", // Only show bookings with completed payment
    })
      .populate("car")
      .sort({ createdAt: -1 });

    // Filter out bookings where car was deleted
    const validBookings = bookings.filter((b) => b.car);

    res.json({ success: true, bookings: validBookings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/** Get bookings for cars owned by the logged-in owner */
export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({
      owner: req.user._id,
      paymentStatus: "completed", // Only show bookings with completed payment
    })
      .populate("car user")
      .select("-user.password")
      .sort({ createdAt: -1 });

    // Filter out bookings where car was deleted
    const validBookings = bookings.filter((b) => b.car);

    res.json({ success: true, bookings: validBookings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/** Update booking status (owner only) */
export const changeBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bookingId, status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking)
      return res.json({ success: false, message: "Booking not found" });
    if (booking.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // If cancelling a paid booking, process refund
    if (
      status === "cancelled" &&
      booking.paymentStatus === "completed" &&
      booking.stripePaymentIntentId
    ) {
      try {
        // Create refund via Stripe
        const refund = await stripe.refunds.create({
          payment_intent: booking.stripePaymentIntentId,
        });

        if (refund.status === "succeeded" || refund.status === "pending") {
          booking.paymentStatus = "refunded";
          booking.status = status;
          await booking.save();
          return res.json({
            success: true,
            message: "Booking cancelled and full refund initiated",
          });
        } else {
          return res.json({
            success: false,
            message: "Refund failed. Please try again.",
          });
        }
      } catch (refundError) {
        console.error("Refund error:", refundError);
        return res.json({
          success: false,
          message: "Refund processing failed: " + refundError.message,
        });
      }
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/** Get all bookings for today */
export const getTodayBookings = async (req, res) => {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Find all bookings that overlap with today
    const bookings = await Booking.find({
      pickupDate: { $lte: endOfToday },
      returnDate: { $gte: today },
      status: { $ne: "cancelled" },
    }).select("car");

    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/** Create Stripe Payment Intent */
export const createPaymentIntent = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    // Verify car availability
    if (!(await checkAvailability(car, pickupDate, returnDate))) {
      return res.json({ success: false, message: "Car Not Available" });
    }

    // Get car data
    const carData = await Car.findById(car);
    if (!carData) {
      return res.json({ success: false, message: "Car not found" });
    }

    // Calculate price
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const days = Math.max(
      Math.ceil((returned - picked) / (1000 * 60 * 60 * 24)),
      1,
    );
    const price = days * carData.pricePerDay;
    const priceInCents = Math.round(price * 100); // Stripe uses cents

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: priceInCents,
      currency: "inr",
      metadata: {
        car: car.toString(),
        user: _id.toString(),
        pickupDate,
        returnDate,
        days,
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      price,
      days,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/** Confirm Payment and Create Booking */
export const confirmPayment = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate, stripePaymentIntentId } = req.body;

    // Verify car availability
    if (!(await checkAvailability(car, pickupDate, returnDate))) {
      return res.json({ success: false, message: "Car Not Available" });
    }

    // Get payment intent details from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(
      stripePaymentIntentId,
    );

    if (paymentIntent.status !== "succeeded") {
      return res.json({
        success: false,
        message: "Payment not completed",
      });
    }

    // Get car data
    const carData = await Car.findById(car);
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const days = Math.max(
      Math.ceil((returned - picked) / (1000 * 60 * 60 * 24)),
      1,
    );
    const price = days * carData.pricePerDay;

    // Create booking with payment completed but pending owner confirmation
    const booking = await Booking.create({
      car,
      user: _id,
      owner: carData.owner,
      pickupDate,
      returnDate,
      price,
      status: "pending", // Pending owner confirmation
      paymentStatus: "completed",
      stripePaymentId: paymentIntent.id,
      stripePaymentIntentId,
    });

    res.json({
      success: true,
      message: "Payment successful! Awaiting owner confirmation",
      booking,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
