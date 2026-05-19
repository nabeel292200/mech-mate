import dotenv from "dotenv";
dotenv.config();

import app from "./src/app";
import connectDB from "./src/config/db";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🚗  ASSIST Backend (TypeScript)");
    console.log(`📡  Server  → http://localhost:${PORT}`);
    console.log(`🌱  Mode    → ${process.env.NODE_ENV}`);
    console.log(`🔑  OTP     → last 4 digits of phone (dev)`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  });
};

process.on("unhandledRejection", (err: any) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1);
});

startServer();
