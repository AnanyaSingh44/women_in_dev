import { MongoClient, ObjectId } from "mongodb";

// Use env or config for URI
const MONGODB_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGODB_URI);

export async function GET(req) {
  // Parse query params: ?status=IN_PROGRESS&type=ONLINE&q=abc&page=1
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (searchParams.get("status")) filter.status = searchParams.get("status");
  if (searchParams.get("type")) filter.incidentType = searchParams.get("type");
  if (searchParams.get("q")) {
    const q = searchParams.get("q");
    filter.$or = [
      { email: { $regex: q, $options: "i" } },
      { complaintId: { $regex: q, $options: "i" } },
    ];
  }

  await client.connect();
  const db = client.db();
  const complaints = db.collection("complaints");

  const items = await complaints
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  const total = await complaints.countDocuments(filter);

  return Response.json({ items, total, page, pageSize: limit });
}

export async function PATCH(req) {
  try {
    const { complaintId, status, priority } = await req.json();

    if (!complaintId) {
      return Response.json({ success: false, message: "Missing complaintId" }, { status: 400 });
    }

    await client.connect();
    const db = client.db();
    const complaints = db.collection("complaints");

    const updateFields = {};
    if (status) updateFields.status = status;
    if (priority) updateFields.priority = priority;

    const result = await complaints.updateOne(
      { complaintId },
      { $set: updateFields }
    );

    return Response.json({
      success: result.modifiedCount === 1,
      updated: updateFields,
    });
  } catch (error) {
    console.error("PATCH error:", error);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  } finally {
    await client.close();
  }
}