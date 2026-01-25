import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./Routes/userRoutes.js";
import ownerRouter from "./Routes/ownerRoutes.js";
import bookingRouter from "./Routes/bookingRoutes.js";
import adminRouter from "./Routes/adminRoutes.js";
import { processAutoRefunds } from "./controllers/bookingController.js";

// Initialize Express app
const app = express();

// Connect to MongoDB
await connectDB();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Health check route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// API routes
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/admin", adminRouter);

// Schedule auto-refund job to run every hour
setInterval(
  () => {
    processAutoRefunds();
  },
  60 * 60 * 1000,
); // 1 hour

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {});
