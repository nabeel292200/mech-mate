import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is missing");
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
