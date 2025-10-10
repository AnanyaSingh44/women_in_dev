import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export async function POST(req, context) {
  await connectDB();
  const params = await context.params;

  const post = await Post.findById(params.id);
  if (!post) {
    console.log("Post not found");
    return Response.json({ success: false, message: "Post not found" }, { status: 404 });
  }

  let userId, isAnonymous, anonId;
  try {
    ({ userId, isAnonymous, anonId } = await req.json());
  } catch {
    console.log("Invalid or missing JSON body");
    return Response.json({ success: false, message: "Invalid or missing JSON body" }, { status: 400 });
  }

  if (isAnonymous) {
    if (!anonId) {
      console.log("anonId required for anonymous upvote");
      return Response.json({ success: false, message: "anonId required for anonymous upvote" }, { status: 400 });
    }
    if (post.anonUpvotes.includes(anonId)) {
      console.log("Already upvoted (anon)");
      return Response.json({ success: false, message: "Already upvoted" }, { status: 400 });
    }
    post.anonUpvotes.push(anonId);
  } else {
    if (!userId) {
      console.log("userId required for upvote");
      return Response.json({ success: false, message: "userId required for upvote" }, { status: 400 });
    }
    if (post.upvotes.includes(userId)) {
      console.log("Already upvoted (user)");
      return Response.json({ success: false, message: "Already upvoted" }, { status: 400 });
    }
    post.upvotes.push(userId);
  }

  await post.save();
  return Response.json({
    success: true,
    upvotes: post.upvotes.length,
    anonUpvotes: post.anonUpvotes.length,
    totalUpvotes: post.upvotes.length + post.anonUpvotes.length,
  });
}