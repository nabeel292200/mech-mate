const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://nabeel:6HUE8TxKaZXBTtMf@cluster0.8w6xcpn.mongodb.net/mech_mate?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  await mongoose.connect(mongoURI);
  
  const ServiceRequest = require('./src/models/ServiceRequest.model').default;
  const User = require('./src/models/User.model').default;
  const Mechanic = require('./src/models/Mechanic.model').default;
  
  // Find the request
  const request = await ServiceRequest.findOne({ _id: "6a1563e0482e6e56b9e3d3e1" });
  if (!request) {
    console.log("Request not found");
    process.exit(0);
  }
  
  console.log("Found request with mechanicId (which is likely the User ID):", request.mechanicId);
  
  // Find the user that has this ID
  const user = await User.findById(request.mechanicId);
  if (user && user.mechanic) {
    console.log("Found the User! Correct mechanic ID is:", user.mechanic);
    
    // Update the request with the CORRECT mechanic ID
    request.mechanicId = user.mechanic;
    await request.save();
    console.log("Successfully fixed the request!");
  } else {
    console.log("User not found or does not have a mechanic profile.");
  }
  
  process.exit(0);
}

run();
