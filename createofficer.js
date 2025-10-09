import dotenv from "dotenv";
dotenv.config();

import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://ananyawork1221_db_user:123@cluster0.ptngld1.mongodb.net/";
if (!MONGODB_URI) throw new Error("MONGODB_URI is required.");

const client = new MongoClient(MONGODB_URI);
await client.connect();
const db = client.db();

async function addRoleToUser(userId, role) {
    const users = db.collection("user");
    const _id = new ObjectId(userId);

    const result = await users.updateOne(
        { _id },
        { $set: { role } }
    );

    if (result.matchedCount === 0) {
        console.log("No user found with _id:", userId);
    } else {
        console.log(`Added role "${role}" to user with _id: ${userId}`);
    }
}

// Usage:
await addRoleToUser("68e7635d949f5bf657b746fe", "OFFICER");

process.exit(0);