import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  requestId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderRole: "user" | "mechanic";
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    requestId: { type: Schema.Types.ObjectId, ref: "ServiceRequest", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderRole: { type: String, enum: ["user", "mechanic"], required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

// Index to quickly fetch chat history for a specific request
messageSchema.index({ requestId: 1, createdAt: 1 });

export default mongoose.model<IMessage>("Message", messageSchema);
