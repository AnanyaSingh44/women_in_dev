import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET(req, context) {
  await connectDB();
  const params = await context.params; // Await params!
  const post = await Post.findById(params.id);
  if (!post) {
    return Response.json({ success: false, message: "Post not found" }, { status: 404 });
  }
  return Response.json({ success: true, comments: post.comments || [] });
}

export async function POST(req, context) {
  await connectDB();
  const params = await context.params; // Await params!
  let content, author, pseudonym;
  try {
    ({ content, author, pseudonym } = await req.json());
  } catch {
    return Response.json({ success: false, message: "Invalid or missing JSON body" }, { status: 400 });
  }
  const post = await Post.findById(params.id);
  if (!post) {
    return Response.json({ success: false, message: "Post not found" }, { status: 404 });
  }
  post.comments.push({ content, author, pseudonym });
  await post.save();
  return Response.json({ success: true, comments: post.comments });
}