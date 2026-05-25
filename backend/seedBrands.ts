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

    // Drop the entire collection to clear out old unique indexes
    await Brand.collection.drop().catch(() => console.log("Collection doesn't exist yet, proceeding..."));
    await Brand.syncIndexes();
    console.log("Cleared existing brands and refreshed indexes.");

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

    const bikeBrandNames = [
      "Hero", "Bajaj", "TVS", "Royal Enfield", "Yamaha", "Honda",
      "Kawasaki", "Suzuki", "KTM", "Ducati", "Harley-Davidson",
      "Triumph", "Aprilia", "Benelli", "BMW Motorrad", "Husqvarna",
      "MV Agusta", "Indian Motorcycle", "CFMoto", "Moto Guzzi"
    ];

    const bikeBrandsToInsert = bikeBrandNames.map(name => ({
      name,
      category: "bike",
      logoUrl: name.slice(0, 2).toUpperCase(),
    }));

    const truckBrandNames = [
      "Tata", "Ashok Leyland", "Mahindra", "Eicher", "BharatBenz",
      "Volvo", "Scania", "MAN", "Mercedes-Benz", "DAF", "Kenworth",
      "Peterbilt", "Freightliner", "Mack", "Isuzu", "Hino", "Fuso"
    ];

    const truckBrandsToInsert = truckBrandNames.map(name => ({
      name,
      category: "truck",
      logoUrl: name.slice(0, 2).toUpperCase(),
    }));

    const busBrandNames = [
      "Ashok Leyland", "Tata", "Eicher", "Volvo", "Scania",
      "Mercedes-Benz", "MAN", "BYD", "Yutong", "King Long",
      "Blue Bird", "Gillig", "Nova Bus", "Marcopolo"
    ];

    const busBrandsToInsert = busBrandNames.map(name => ({
      name,
      category: "bus",
      logoUrl: name.slice(0, 2).toUpperCase(),
    }));

    brandsToInsert.push(...bikeBrandsToInsert);
    brandsToInsert.push(...truckBrandsToInsert);
    brandsToInsert.push(...busBrandsToInsert);

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
