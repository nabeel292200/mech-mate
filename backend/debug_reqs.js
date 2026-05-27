require("dotenv").config();
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI || "mongodb+srv://nabeel:6HUE8TxKaZXBTtMf@cluster0.8w6xcpn.mongodb.net/mech_mate?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

    const ServiceRequest = require("./src/models/ServiceRequest.model").default;
    const reqs = await ServiceRequest.find().sort({ createdAt: -1 }).limit(2);
    console.log("Latest 2 requests:");
    console.log(JSON.stringify(reqs, null, 2));

    // Try creating a test request
    const mockUserId = reqs[0]?.userId || "60d0fe4f5311236168a109ca";
    const newReq = await ServiceRequest.create({
      userId: mockUserId,
      brandName: "Toyota",
      problemDetails: "Test details",
      userLocation: { lat: 10, lng: 76 },
      status: "pending"
    });
    console.log("Created successfully:", newReq._id);
  } catch (err) {
    console.error("Error creating request:", err);
  } finally {
    mongoose.disconnect();
  }
}
run();
