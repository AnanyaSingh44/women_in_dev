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

export async function GET(req) {
  try {
    await connectDB();

    // 1. Get the user ID from the server-side session (CRUCIAL SECURITY STEP)
    // NOTE: You must replace this placeholder with your actual BetterAuth session retrieval logic
    // const session = await getServerSession(authOptions);
    // if (!session || !session.user.id) {
    //   return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    // }
    // const userId = session.user.id;
    
    // --- TEMPORARY MOCK (Replace with real session logic) ---
    // Since the client-side passes the user prop, let's assume we can pass it via headers for now,
    // but the SECURE way is via server-side session/cookie validation.
    // Since we can't access client-side headers directly here without more context,
    // we'll fetch all complaints and rely on future server-side filtering, or
    // for this user dashboard, we MUST filter by the currently logged-in user.
    
    // For now, let's return all non-anonymous complaints or rely on a user ID parameter
    // from the client if it were secure. Given the current setup, we must assume
    // the user ID is available on the server via BetterAuth session.
    
    // *** Placeholder for user ID filter ***
    // const userIdToFilter = "60c728b9c8d5c40015f8e5f2"; // Replace with actual session user ID
    // const complaints = await Complaint.find({ userId: userIdToFilter }).sort({ createdAt: -1 });
    // *** End Placeholder ***
    
    // For a quick fix that doesn't filter, but removes the 405 error:
    const complaints = await Complaint.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, complaints });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error fetching complaints", error: err.message },
      { status: 500 }
    );
  }
}
