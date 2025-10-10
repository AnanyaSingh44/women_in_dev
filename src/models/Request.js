import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  targetId: { type: String, required: true },       // store as string
  targetName: { type: String, required: true },
  targetEmail: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Contacted", "Closed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Request || mongoose.model("Request", RequestSchema);
