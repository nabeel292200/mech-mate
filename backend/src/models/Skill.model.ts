import mongoose, { Document, Schema } from "mongoose";

export interface ISkill extends Document {
  name: string;
  category: string;
  isActive: boolean;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true, enum: ["mechanical", "electrical", "tire", "general"] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Create compound index for fast lookups and unique skill per category
SkillSchema.index({ category: 1, name: 1 }, { unique: true });

export default mongoose.model<ISkill>("Skill", SkillSchema);
