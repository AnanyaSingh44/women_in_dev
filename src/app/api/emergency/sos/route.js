import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import SOSAlert from "@/models/SOSAlert";
import { auth } from "@/lib/auth"; // if using better-auth or NextAuth
import { connectDB } from "@/lib/mongodb";

// Connect to MongoDB (ensure you already have db connection file)


export async function POST(req) {
  try {
    const body = await req.json();
    const { latitude, longitude, locationLink, message } = body;

  await connectDB();
    const session = await auth.api.getSession({ headers: req.headers });
    // Get logged-in user details if available
    const user = session?.user || null;

    const newAlert = await SOSAlert.create({
      userId: user?._id || null,
      name: user?.name || "Anonymous",
      email: user?.email || "N/A",
      latitude,
      longitude,
      locationLink,
      message,
    });

    // Setup email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    // Emergency email content
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: process.env.EMERGENCY_RECEIVER, // receiver email (officer/admin)
      subject: "🚨 SOS Alert Triggered!",
      html: `
        <h3>🚨 SOS Alert Received</h3>
        <p><b>Name:</b> ${newAlert.name}</p>
        <p><b>Email:</b> ${newAlert.email}</p>
        <p><b>Message:</b> ${newAlert.message}</p>
        <p><b>Location:</b> <a href="${newAlert.locationLink}" target="_blank">${newAlert.locationLink}</a></p>
        <p><i>Alert generated on ${new Date().toLocaleString()}</i></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "SOS alert sent successfully!" });
  } catch (error) {
    console.error("SOS Alert Error:", error);
    return NextResponse.json({ success: false, error: "Failed to send SOS alert" }, { status: 500 });
  }
}
