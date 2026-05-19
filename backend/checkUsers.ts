import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.model";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

async function checkDb() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected.");
    
    const users = await User.find({}).lean();
    console.log(`\nFound ${users.length} users in the database:\n`);
    
    users.forEach((u, i) => {
      console.log(`${i + 1}. Phone: ${u.phone} | Role: ${u.role} | Name: ${u.name || "N/A"}`);
    });
    
  } catch (error) {
    console.error("Error connecting to DB:", error);
  } finally {
    mongoose.connection.close();
    console.log("\nDisconnected.");
  }
}

checkDb();
