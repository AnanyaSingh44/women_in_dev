import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    // Connect to MongoDB
    const conn = await connectDB();

    // Use mongoose.connection.db to access the database
    const db = mongoose.connection.db;

    // Fetch counsellors and lawyers
    const users = await db
      .collection("user")
      .find(
        { role: { $in: ["COUNSELLOR", "LAWYER"] } },
        { projection: { name: 1, email: 1, role: 1 } }
      )
      .toArray();

    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    console.error("Error fetching counsellors:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch counsellors", error: err.message },
      { status: 500 }
    );
  }
}
