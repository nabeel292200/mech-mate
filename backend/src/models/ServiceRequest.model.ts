import mongoose, { Schema, Document } from "mongoose";

export interface IServiceRequest extends Document {
  userId: string;
  mechanicId?: string;
  brandName: string;
  problemDetails: string;
  userLocation: { lat: number; lng: number };
  status: "pending" | "accepted" | "invoiced" | "completed" | "cancelled";
  paymentStatus?: "pending" | "completed";
  paymentMethod?: string;
  totalAmount?: number;
  invoiceItems?: Array<{ description: string; price: number }>;
}

const ServiceRequestSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mechanicId: { type: Schema.Types.ObjectId, ref: "Mechanic" },
    brandName: { type: String, required: true },
    problemDetails: { type: String, required: true },
    userLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "invoiced", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    paymentMethod: { type: String },
    totalAmount: { type: Number, default: 0 },
    invoiceItems: [
      {
        description: { type: String },
        price: { type: Number },
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IServiceRequest>("ServiceRequest", ServiceRequestSchema);
