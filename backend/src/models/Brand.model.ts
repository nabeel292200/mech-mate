import mongoose, { Document, Schema } from "mongoose";

export interface IBrand extends Document {
  name: string;
  category: string;
  logoUrl?: string;
  isActive: boolean;
}

const BrandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true, enum: ["car", "bike", "truck", "bus", "all"] },
    logoUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Create compound index for fast lookups by category
BrandSchema.index({ category: 1, name: 1 });

export default mongoose.model<IBrand>("Brand", BrandSchema);
