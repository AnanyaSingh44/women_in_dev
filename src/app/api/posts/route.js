import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { auth } from "@/lib/auth";

// GET: Fetch all posts
export async function GET(req) {
  try {
    await connectDB();

    const session = await auth.api.getSession({ headers: req.headers });
    const userId = session?.user?.id;

    // If not logged in, show only public/anonymous posts
    const posts = await Post.find(
      userId ? {} : { isPublic: true }
    ).sort({ createdAt: -1 }); // No populate!

    return NextResponse.json({ success: true, posts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST: Create a new post (anonymous or logged-in)
export async function POST(req) {
  try {
    await connectDB();
    const session = await auth.api.getSession({ headers: req.headers });
    const user = session?.user;
    const body = await req.json();
    const { content, asAnonymous, pseudonym } = body;

    if (!content) {
      return NextResponse.json(
        { success: false, message: "Missing content" },
        { status: 400 }
      );
    }

    let postData = {
      content,
      isPublic: true, // set true by default, adjust logic if you need private posts later
    };

    if (user && !asAnonymous) {
      // Save values from the session directly, as plain object
      postData.author = {
        name: user.name,
        email: user.email,
        image: user.image,
        id: user.id,
      };
      postData.pseudonym = null;
    } else {
      postData.author = null;
      postData.pseudonym = pseudonym || "Anonymous";
    }

    const post = await Post.create(postData);
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create post" },
      { status: 500 }
    );
  }
}