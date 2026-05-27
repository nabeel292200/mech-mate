const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://nabeel:6HUE8TxKaZXBTtMf@cluster0.8w6xcpn.mongodb.net/mech_mate?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  await mongoose.connect(mongoURI);
  
  const ServiceRequest = require('./src/models/ServiceRequest.model').default;
  const requests = await ServiceRequest.find().sort({ createdAt: -1 }).limit(1);
  
  console.log("Latest Request:");
  console.log(JSON.stringify(requests, null, 2));
  
  process.exit(0);
}

run();
