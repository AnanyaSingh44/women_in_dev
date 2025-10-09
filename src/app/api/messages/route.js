import {connectDB} from "@/lib/mongodb";
import Complaint from "@/models/Complaint";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const complaintId = searchParams.get("complaintId");
  if (!complaintId) return Response.json({ error: "Missing complaintId" }, { status: 400 });

  await connectDB();
  const complaint = await Complaint.findOne({ complaintId });
  if (!complaint) return Response.json({ messages: [] });
  return Response.json({ messages: complaint.messages || [] });
}

export async function POST(req) {
  const { complaintId, sender, senderName, message } = await req.json();
  if (!complaintId || !sender || !message) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  await connectDB();
  const complaint = await Complaint.findOne({ complaintId });
  if (!complaint) return Response.json({ error: "Complaint not found" }, { status: 404 });

  const msgObj = {
    sender,
    senderName: senderName || (sender === "officer" ? "Officer" : "Anonymous"),
    message,
    timestamp: new Date(),
  };

  // 👇 Ensure messages array exists before pushing
  if (!Array.isArray(complaint.messages)) {
    complaint.messages = [];
  }

  complaint.messages.push(msgObj);
  await complaint.save();

  return Response.json({ success: true, message: msgObj });
}
