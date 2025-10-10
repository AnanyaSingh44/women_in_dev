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
  // Destructure the expected fields from the request body
  const { complaintId, sender, senderName, message } = await req.json();

  // 1. Validation
  if (!complaintId || !sender || !message) {
    return Response.json({ error: "Missing required fields: complaintId, sender, or message" }, { status: 400 });
  }

  try {
    await connectDB();

    // 2. Construct the message object with a unique ID and timestamp
    const msgObj = {
      sender,
      senderName: senderName || (sender === "officer" ? "Officer" : "Anonymous"),
      message,
      timestamp: new Date(),
    };

    // 3. Find the complaint and push the new message
    const result = await Complaint.findOneAndUpdate(
      { 
        // Use the complaintId provided in the data
        complaintId 
      },
      {
        // $push operator adds the element to the messages array
        $push: { messages: msgObj },
      },
      { 
        new: true, // Return the document *after* the update
      }
    );

    // 4. Check if the complaint was found and updated
    if (!result) {
      return Response.json({ error: "Complaint not found or could not be updated" }, { status: 404 });
    }

    // 5. Success response
    return Response.json({ success: true, message: msgObj });

  } catch (error) {
    console.error("Error sending message to complaint:", error);
    // Return a generic error message
    return Response.json({ error: "Internal server error during message posting" }, { status: 500 });
  }
}
