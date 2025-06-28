import mongoose from "mongoose";
// import dotenv from "dotenv";

// Load environment variables **before** accessing them
// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) {
//   console.error("MONGO_URI is not defined. Check your .env file.");
//   process.exit(1);
// }

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/FLIGHTSDATA", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
