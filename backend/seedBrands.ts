import mongoose from "mongoose";
import dotenv from "dotenv";
import Brand from "./src/models/Brand.model";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

const seedBrands = async () => {
  try {
    console.log("Connecting to MongoDB for seeding brands...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected.");

    // Clear existing brands
    await Brand.deleteMany({});
    console.log("Cleared existing brands.");

    // Comprehensive list of car brands mapped to "car" category
    const carBrandNames = [
      "Toyota", "Honda", "Nissan", "Suzuki", "Mazda", "Mitsubishi", 
      "Hyundai", "Kia", "BMW", "Mercedes-Benz", "Audi", "Volkswagen", 
      "Porsche", "Ferrari", "Lamborghini", "Renault", "Peugeot", "Citroen", 
      "Volvo", "Jaguar", "Land Rover", "Ford", "Chevrolet", "Tesla", "Jeep", 
      "Dodge", "GMC", "Cadillac", "Chrysler", "Tata", "Mahindra", 
      "Maruti Suzuki", "Subaru", "Lexus", "Infiniti", "Acura", "Bentley", 
      "Rolls-Royce", "Aston Martin", "Bugatti", "Maserati"
    ];

    const brandsToInsert = carBrandNames.map(name => ({
      name,
      category: "car",
      // Take first 1-2 letters as logo
      logoUrl: name.slice(0, 2).toUpperCase(),
    }));

    // Optionally add some bike/truck brands to be complete
    brandsToInsert.push({ name: "Royal Enfield", category: "bike", logoUrl: "RE" });
    brandsToInsert.push({ name: "Yamaha", category: "bike", logoUrl: "YA" });
    brandsToInsert.push({ name: "Ashok Leyland", category: "truck", logoUrl: "AL" });

    await Brand.insertMany(brandsToInsert);
    console.log(`Successfully seeded ${brandsToInsert.length} brands into the database!`);

  } catch (error) {
    console.error("Error seeding brands:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

seedBrands();
