import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import Complaint from "@/models/Complaint";
import { auth } from "@/lib/auth"; 

export async function GET(req) {
  try {
    await connectDB();

    // Get session / user from request
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const complaints = await Complaint.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, complaints }, { status: 200 });
  } catch (err) {
    console.error("Error fetching user complaints:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export const dynamic ='force-dynamic';
export const revalidate=0;
