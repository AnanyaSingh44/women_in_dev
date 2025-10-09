import mongoose from 'mongoose';

let isConnected = false;
console.log("hiiiiiiii");
console.log("MONGODB_URI:", process.env.MONGODB_URI);

export const connectDB = async () => {
  if (isConnected) return;
  if (!process.env.MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is not defined in .env");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};
