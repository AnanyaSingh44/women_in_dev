// app/api/requests/[id]/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import { auth } from "@/lib/auth";
import mongoose from "mongoose";

export async function PUT(req, { params }) {
    try {
        await connectDB();
        const { id } =await params; // The request ID from the URL: /api/requests/1234
        
        // 🚨 SECURITY: Check if user is an OFFICER before allowing update
        const session = await auth.api.getSession({ headers: req.headers });
      

        // 1. Get the new status from the request body
        const { status } = await req.json();

        if (!status || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, message: "Invalid ID or missing status" }, { status: 400 });
        }
        
        // 2. Update the request
        const updatedRequest = await Request.findByIdAndUpdate(
            id,
            { status, updatedAt: new Date() },
            { new: true, runValidators: true } // Return the modified doc
        );

        if (!updatedRequest) {
            return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, request: updatedRequest });
    } catch (err) {
        console.error("PUT /api/requests/[id] failed:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}