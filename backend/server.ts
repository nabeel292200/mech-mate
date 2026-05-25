import dotenv from "dotenv";
dotenv.config();

import app from "./src/app";
import connectDB from "./src/config/db";
import { migrateLegacyMechanics } from "./src/utils/migration.utils";

import http from "http";
import { initSocket } from "./src/socket";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();
  await migrateLegacyMechanics();

  const server = http.createServer(app);
  initSocket(server);

  server.listen(PORT, () => {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🚗  MECH-MATE Backend (TypeScript)");
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
