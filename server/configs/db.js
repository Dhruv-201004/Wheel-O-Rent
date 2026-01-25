import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected"),
    );
    await mongoose.connect(`${process.env.MONGODB_URL}/car-rental`);
  } catch (error) {}
};
export default connectDB;
