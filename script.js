import dotenv from "dotenv";
dotenv.config();

import { MongoClient } from "mongodb";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://ananyawork1221_db_user:123@cluster0.ptngld1.mongodb.net/";

if (!MONGODB_URI) throw new Error("MONGODB_URI is required.");

async function fixComplaints() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();

    // ✅ Specify your database name explicitly
    const db = client.db(); // <-- change to your actual DB name if not "test"

    // ✅ Use the collection method correctly
    const result = await db.collection("complaints").updateMany(
      { messages: { $exists: false } },
      { $set: { messages: [] } }
    );

    console.log(`✅ Updated ${result.modifiedCount} complaint(s) successfully.`);
  } catch (err) {
    console.error("❌ Error updating complaints:", err);
  } finally {
    await client.close();
  }
}

fixComplaints();
