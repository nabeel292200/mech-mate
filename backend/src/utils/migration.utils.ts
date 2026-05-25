import mongoose from "mongoose";
import User from "../models/User.model";
import Mechanic from "../models/Mechanic.model";

export const migrateLegacyMechanics = async (): Promise<void> => {
  try {
    console.log("[MIGRATION] Checking for legacy inline mechanics...");
    const users = await User.find({ role: "mechanic" }).lean();
    
    let migratedCount = 0;
    
    for (const rawUser of users) {
      const legacyMechanic = rawUser.mechanic;
      
      // If legacyMechanic is an object and NOT a reference (not an ObjectId or string representation of ObjectId)
      if (
        legacyMechanic &&
        typeof legacyMechanic === "object" &&
        !mongoose.Types.ObjectId.isValid(legacyMechanic.toString())
      ) {
        console.log(`[MIGRATION] Migrating legacy mechanic for user: ${rawUser.phone}`);
        
        // Create new Mechanic document
        const mechanicDoc = await Mechanic.create({
          experience: legacyMechanic.experience ?? 0,
          workshopAddress: legacyMechanic.workshopAddress ?? "",
          vehicleSkills: legacyMechanic.vehicleSkills ?? [],
          brandExpertise: legacyMechanic.brandExpertise ?? [],
          isAvailable: legacyMechanic.isAvailable ?? false,
          liveLocation: legacyMechanic.liveLocation !== false,
          rating: legacyMechanic.rating ?? 0,
          totalJobs: legacyMechanic.totalJobs ?? 0,
        });

        // Update user to point to the new mechanic document
        await User.updateOne({ _id: rawUser._id }, { $set: { mechanic: mechanicDoc._id } });
        migratedCount++;
      }
    }
    
    if (migratedCount > 0) {
      console.log(`[MIGRATION] Migration complete. Migrated ${migratedCount} legacy mechanic profiles.`);
    } else {
      console.log("[MIGRATION] No legacy inline mechanics found.");
    }
  } catch (err: any) {
    console.error("[MIGRATION] Migration error occurred:", err.message);
  }
};
