import dotenv from "dotenv";
dotenv.config();

import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { betterAuth } from "better-auth";

// --- Ensure MONGODB_URI is available in .env.local ---
const MONGODB_URI = process.env.MONGODB_URI;
// console.log("Google ID:", process.env.GOOGLE_CLIENT_ID);

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is required for database connection.');
}

// Initialize Mongo client once and reuse connection
const client = new MongoClient(MONGODB_URI);
const dbConnect = client.connect();
const db = (await dbConnect).db();

export const auth = betterAuth({
  database: mongodbAdapter(db, 
    { client }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      // clientId: process.env.GOOGLE_CLIENT_ID,
      // clientSecret: "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",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
callbacks:{
   async session({ session, user }) {
      // console.log("User in session callback:", user);
      session.user.role = user.role; // This is the key line!
      return session;
}
},
  secret: process.env.BETTER_AUTH_SECRET,
});

export const databaseConnection = dbConnect;
