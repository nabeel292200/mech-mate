import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  phone: string;
  password?: string;
  role: "user" | "mechanic";
  name: string;
  isProfileComplete: boolean;
  isActive: boolean;
  mechanic?: any;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Phone must be exactly 10 digits"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Don't return password in queries by default
    },
    role: {
      type: String,
      enum: ["user", "mechanic"],
      required: [true, "Role is required"],
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    mechanic: {
      type: Schema.Types.ObjectId,
      ref: "Mechanic",
      default: null,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
