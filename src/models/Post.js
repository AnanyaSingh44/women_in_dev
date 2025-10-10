import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: {
    name: String,
    email: String,
    image: String,
    id: String,
  },
  pseudonym: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const PostSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: {
    name: String,
    email: String,
    image: String,
    id: String,
  },
  pseudonym: { type: String, default: null },
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  upvotes: [{ type: String }],       // Store user IDs (string) for upvotes
  anonUpvotes: [{ type: String }],   // Anonymous upvotes (random ids or pseudonyms)
  comments: [CommentSchema],
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);