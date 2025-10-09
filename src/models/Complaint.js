import mongoose from "mongoose";
import MessageSchema from "./Message";

const ComplaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    fullName: {
      type: String,
      trim: true,
    },
    complaintId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    incidentType: {
      type: String,
      enum: ["VERBAL", "PHYSICAL", "ONLINE", "WORKPLACE", "OTHER"],
      required: true,
    },
    incidentDescription: {
      type: String,
      required: true,
      minlength: 20,
      trim: true,
    },
    incidentDate: {
      type: Date,
      required: true,
    },
    incidentTime: {
      type: String,
      trim: true,
    },
    incidentLocation: {
      type: String,
      trim: true,
    },
    attachments: {
      type: [String],
      default: [],
    },
    accusedName: {
      type: String,
      trim: true,
    },
    accusedPosition: {
      type: String,
      trim: true,
    },
    organization: {
      type: String,
      trim: true,
    },
    witnesses: {
      type: [String],
      default: [],
    },
    previousIncidents: {
      type: String,
      trim: true,
    },
    emotionalState: {
      type: String,
      enum: ["SCARED", "ANXIOUS", "ANGRY", "CALM", "CONFUSED", "OTHER"],
    },
    needImmediateHelp: {
      type: Boolean,
      default: false,
    },
    severityScore: {
      type: Number,
      min: 0,
      max: 1,
    },
    categoryPredicted: {
      type: String,
      trim: true,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["PENDING", "IN_REVIEW", "RESOLVED", "REJECTED"],
      default: "PENDING",
    },
    messages: {
      type: [MessageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Complaint ||
  mongoose.model("Complaint", ComplaintSchema);