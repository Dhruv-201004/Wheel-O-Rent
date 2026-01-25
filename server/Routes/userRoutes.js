import express from "express";
import {
  getCars,
  getUserData,
  loginUser,
  registerUser,
  updateProfileImage,
  uploadProfileImage,
  updateUserName,
  getAvailableLocations,
} from "../controllers/userController.js";
import protect from "../middleware/auth.js";
import maintenanceCheck from "../middleware/maintenanceCheck.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post("/register", maintenanceCheck, registerUser);
userRouter.post("/login", maintenanceCheck, loginUser);
userRouter.get("/data", protect, getUserData);
userRouter.get("/cars", protect, getCars);
userRouter.get("/locations", getAvailableLocations);
userRouter.get("/cars-public", getCars);
userRouter.post("/update-image", protect, updateProfileImage);
userRouter.post(
  "/upload-image",
  protect,
  upload.single("image"),
  uploadProfileImage,
);
userRouter.post("/update-name", protect, updateUserName);

export default userRouter;
