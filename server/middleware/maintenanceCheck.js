import Settings from "../models/Settings.js";
import User from "../models/User.js";

const maintenanceCheck = async (req, res, next) => {
  try {
    const settings = await Settings.findOne();
    
    if (settings && settings.maintenanceMode) {
      // Allow login/register to proceed, we'll check in the controller
      // Pass maintenance status to request
      req.maintenanceMode = true;
      
      // For login requests, check if user is admin
      if (req.body && req.body.email) {
        const user = await User.findOne({ email: req.body.email });
        if (user && user.isAdmin) {
          // Allow admin to proceed
          return next();
        }
      }
      
      // Block non-admin users
      return res.json({
        success: false,
        message: settings.maintenanceMessage || "Site is under maintenance",
        maintenanceMode: true,
      });
    }
    
    next();
  } catch (error) {
    next();
  }
};

export default maintenanceCheck;
