import mongoose, { Document, Schema } from "mongoose";

export interface IMechanic extends Document {
  experience: number;
  workshopAddress: string;
  vehicleSkills: string[];
  brandExpertise: string[];
  isAvailable: boolean;
  liveLocation: boolean;
  rating: number;
  totalJobs: number;
  idProofUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const mechanicSchema = new Schema<IMechanic>(
  {
    experience: { type: Number, default: 0 },
    workshopAddress: { type: String, default: "" },
    vehicleSkills: { type: [String], default: [] },
    brandExpertise: { type: [String], default: [] },
    isAvailable: { type: Boolean, default: false },
    liveLocation: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    totalJobs: { type: Number, default: 0 },
    idProofUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IMechanic>("Mechanic", mechanicSchema);
