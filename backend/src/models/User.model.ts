import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  phone?: string;
  email?: string;
  password?: string;
  role: "user" | "admin" | "mechanic";
  name: string;
  avatar?: string;
  isProfileComplete: boolean;
  isActive: boolean;
  approvalStatus: "pending" | "approved" | "rejected";
  mechanic?: any;
  resetCode?: string;
  resetCodeExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      match: [/^\d{10}$/, "Phone must be exactly 10 digits"],
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Don't return password in queries by default
    },
    role: {
      type: String,
      enum: ["user", "admin", "mechanic"],
      required: [true, "Role is required"],
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    avatar: {
      type: String,
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
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    mechanic: {
      type: Schema.Types.ObjectId,
      ref: "Mechanic",
      default: null,
    },
    resetCode: {
      type: String,
    },
    resetCodeExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Validate that either phone or email is present based on role
userSchema.pre<IUser>("validate", function (next) {
  if (this.role === "user" && !this.phone) {
    next(new Error("Phone number is required for users"));
  } else if ((this.role === "admin" || this.role === "mechanic") && !this.email) {
    next(new Error("Email address is required for admins and mechanics"));
  } else {
    next();
  }
});

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
