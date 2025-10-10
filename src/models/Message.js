import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ["officer", "complainee","public"],
      required: true,
    },
    senderName: {
      type: String,
      default: "Anonymous",
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

export default MessageSchema;