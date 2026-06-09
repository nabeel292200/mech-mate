const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  const db = mongoose.connection.db;

  const mechanics = await db.collection("mechanics").find({}).sort({ updatedAt: -1 }).limit(2).toArray();
  console.log("\n--- Latest Mechanics ---");
  console.dir(mechanics, { depth: null });

  const requests = await db.collection("servicerequests").find({}).sort({ createdAt: -1 }).limit(2).toArray();
  console.log("\n--- Latest Requests ---");
  console.dir(requests, { depth: null });

  process.exit(0);
}

check().catch(console.error);
