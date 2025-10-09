import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import Complaint from "@/models/Complaint";

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.json();

    // Generate complaint ID if not provided
    if (!data.complaintId) {
      const random = Math.floor(1000 + Math.random() * 9000);
      const year = new Date().getFullYear();
      data.complaintId = `SHC-${year}-${random}`;
    }

    // If anonymous, remove user info
    if (data.isAnonymous) {
      delete data.userId;
      delete data.fullName;
    }

    // Check for duplicate complaintId just in case
    const existing = await Complaint.findOne({ complaintId: data.complaintId });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Complaint ID already exists, try again" },
        { status: 400 }
      );
    }

    const newComplaint = await Complaint.create(data);

    return NextResponse.json(
      {
        success: true,
        message: "Complaint submitted successfully",
        complaintId: newComplaint.complaintId,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
