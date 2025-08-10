import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes by verifying JWT
const protect = async (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

  // Deny access if no token is provided
  if (!token) {
    return res.json({ success: false, message: "Not authorized" });
  }

  try {
    // Verify token and extract user ID
    const userId = jwt.verify(token, process.env.JWT_SECRET);

    if (!userId) {
      return res.json({ success: false, message: "Not authorized" });
    }

    // Attach user data to request object (excluding password)
    req.user = await User.findById(userId).select("-password");
    next();
  } catch (error) {
    return res.json({ success: false, message: "Not authorized" });
  }
};

export default protect;
