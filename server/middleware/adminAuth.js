import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect admin routes by verifying JWT and checking admin status
const adminAuth = async (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

  // Deny access if no token is provided
  if (!token) {
    return res.json({
      success: false,
      message: "Please log in first to access admin panel",
    });
  }

  try {
    // Verify token and extract user ID
    const userId = jwt.verify(token, process.env.JWT_SECRET);

    if (!userId) {
      return res.json({
        success: false,
        message: "Please log in first to access admin panel",
      });
    }

    // Attach user data to request object
    const user = await User.findById(userId).select("-password");

    // Check if user is admin
    if (!user || !user.isAdmin) {
      return res.json({
        success: false,
        message: "Admin access only. Please contact support",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.json({
      success: false,
      message: "Please log in first to access admin panel",
    });
  }
};

export default adminAuth;
