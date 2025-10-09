import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import Complaint from "@/models/Complaint";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params; // complaintId
    const complaint = await Complaint.findOne({ complaintId: id });

    if (!complaint) {
      return NextResponse.json({ success: false, message: "Complaint not found" }, { status: 404 });
    }

    // Only return minimal info for anonymous tracking
    return NextResponse.json({
      success: true,
      complaintId: complaint.complaintId,
      status: complaint.status,
      incidentType: complaint.incidentType,
      createdAt: complaint.createdAt,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
