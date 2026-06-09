const mongoose = require("mongoose");

async function fixIndex() {
  try {
    await mongoose.connect("mongodb+srv://nabeel:6HUE8TxKaZXBTtMf@cluster0.8w6xcpn.mongodb.net/mech_mate");
    console.log("Connected to MongoDB.");
    
    const db = mongoose.connection.db;
    const collection = db.collection("users");
    
    // Drop the phone_1 index
    await collection.dropIndex("phone_1");
    console.log("Dropped phone_1 index.");
    
    // Create it with sparse: true
    await collection.createIndex({ phone: 1 }, { unique: true, sparse: true, background: true });
    console.log("Created phone_1 index with sparse: true.");
    
  } catch (error) {
    console.error("Error fixing index:", error);
  } finally {
    process.exit(0);
  }
}

fixIndex();
