import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

// Load environment variables from .env file
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    // Use throw new Error instead of console.log + exit for better error handling
    throw new Error("MONGODB_URI environment variable is required.");
}

async function addRoleToUser(userIdString, role) {
    const client =  new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db(); // uses the default DB from the connection string
        const users = db.collection("user"); // **Ensure this collection name is correct**

        let userId;
        try {
            // Convert the string ID to a MongoDB ObjectId
            userId = new ObjectId(userIdString);
        } catch (e) {
            console.error(`Invalid ObjectId format for userId: ${userIdString}`);
            return;
        }
        
        const query = { _id: userId };

        console.log(`Attempting to set role "${role}" for user ID: ${userIdString}`);
        
        const result = await users.updateOne(query, {
            $set: {
                role: role.toUpperCase(), // Best practice: use consistent case
                updatedAt: new Date()
            }
        });

        if (result.matchedCount === 0) {
            console.log("❌ Update failed: No user found with _id:", userIdString);
        } else if (result.modifiedCount === 0) {
            console.log("⚠️ Update succeeded: User found, but role was already set to that value.");
        } 
        else {
            console.log(`✅ Success! Updated ${result.modifiedCount} user.`);
            console.log(`Role changed to "${role.toUpperCase()}" for user with _id: ${userIdString}`);
        }

    } catch (err) {
        console.error("🚨 MongoDB Operation Failed:", err);
    } finally {
        // Ensure the client connection is closed
        await client.close();
    }
}

// --- Execution ---
const userIdToUpdate = "68e885b2e3cad42b17058310"; 
const newRole = "LAWYER";

(async () => {
    await addRoleToUser(userIdToUpdate, newRole);
    // Explicitly exit the process to ensure termination after the script finishes
    process.exit(0);
})();

// To run this file, save it (e.g., as updateRole.js) and execute in your terminal:
// node updateRole.js