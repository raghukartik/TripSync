import "dotenv/config";
import mongoose from "mongoose";

export const connectDB = async () => {
  console.log("from db.js: ",process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
};
