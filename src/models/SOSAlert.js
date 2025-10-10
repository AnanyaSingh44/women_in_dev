import mongoose from "mongoose";

const SOSAlertSchema = new mongoose.Schema(
  {
    userId: { type: String, default: null }, // null for guest users
    name: { type: String, default: "Anonymous" },
    email: { type: String, default: "N/A" },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    locationLink: { type: String, required: true },
    message: { type: String, default: "Emergency! SOS alert triggered." },
  },
  { timestamps: true }
);

export default mongoose.models.SOSAlert || mongoose.model("SOSAlert", SOSAlertSchema);
