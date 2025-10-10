"use client";
import { useEffect, useState } from "react";
import { generatePseudonym } from "../utility/pseudonym";

/**
 * CommunityBoard - Combines PostForm and PostList in a beautiful community style.
 *
 * Props:
 * user: { name?: string, id?: string }
 */
export default function CommunityBoard({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from API
  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        setPosts([...data.posts]);
      } else if (Array.isArray(data)) {
        setPosts([...data]);
      } else {
        console.error("Unexpected API response:", data);
      }
    } catch (e) {
      console.error("Failed to fetch posts", e);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handler for when a new post is submitted
  function handleNewPost() {
    fetchPosts();
  }

  // Handler for refreshing after upvote or comment
  function handlePostInteraction() {
    fetchPosts();
  }

 return (
    <div className="min-h-[80vh] w-full bg-rose-50 px-4 py-8">
      <div className="max-w-[150vh] mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-2 text-pink-700">
          Women Harassment Community Board
        </h2>
        <p className="text-center text-pink-600 font-semibold mb-2">
          Curated access to verified legal aid, counselling services, and awareness resources.
        </p>
        <p className="text-center text-gray-600 mb-8 italic">
          All posts and comments are <span className="font-bold">anonymous</span> by default. If you are logged in, your identity may be visible to admins for safety and support purposes.
        </p>
         {/*
          2. POST FORM (MOVED TO THE BOTTOM)
        */}
        <div className="mt-10 pt-8 border-t border-rose-200">
             <h3 className="text-2xl font-bold mb-4 text-pink-700">Share Your Story or Ask for a Fix</h3>
             <PostForm user={user} onPost={handleNewPost} />
        </div>
        {/*
          1. POSTS SECTION (MOVED TO THE TOP)
        */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-4 text-pink-700">Recent Stories & Questions</h3>
          <PostList posts={posts} loading={loading} user={user} onInteract={handlePostInteraction}/>
        </div>

       
      </div>
    </div>
  );
}


// PostForm component
function PostForm({ user, onPost }) {
  const [content, setContent] = useState("");
  const [asAnonymous, setAsAnonymous] = useState(false);
  const [pseudonym, setPseudonym] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (asAnonymous) {
      let stored = localStorage.getItem("pseudonym");
      if (!stored) {
        stored = generatePseudonym();
        localStorage.setItem("pseudonym", stored);
      }
      setPseudonym(stored);
    }
  }, [asAnonymous]);

  async function submitPost(e) {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        asAnonymous,
        pseudonym: asAnonymous ? pseudonym : null,
      }),
    });
    setContent("");
    setSubmitting(false);
    if (onPost) onPost();
  }

  return (
    <form
      onSubmit={submitPost}
      className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100"
    >
      <div className="mb-4">
        {/* <label className="block text-lg font-bold mb-2 text-pink-700">
          What do you need fixed or beautified?
        </label> */}
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Feel free to share your thoughts..."
          required
          rows={4}
          disabled={submitting}
          className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition outline-none p-3 resize-vertical text-gray-800 shadow-inner"
        />
      </div>
      <div className="flex items-center justify-between">
        {user && (
          <label className="inline-flex items-center cursor-pointer text-gray-600">
            <input
              type="checkbox"
              checked={asAnonymous}
              onChange={e => setAsAnonymous(e.target.checked)}
              className="form-checkbox rounded text-pink-600 mr-2"
            />
            <span className="text-sm">Post as anonymous</span>
          </label>
        )}
        <button
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 text-white px-7 py-2 rounded-xl font-semibold shadow-lg transition-all duration-150"
          disabled={submitting}
        >
          {submitting ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}

// CommentForm component
function CommentForm({ postId, user, onComment }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        author: user ? { name: user.name, id: user.id } : undefined,
      }),
    });
    setContent("");
    setSubmitting(false);
    if (onComment) onComment();
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 mt-2">
      <input
        type="text"
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Add a comment..."
        disabled={submitting}
        className="flex-1 rounded-lg text-gray-500 border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-pink-300 transition outline-none shadow"
      />
      <button
        type="submit"
        disabled={submitting || !content.trim()}
        className="bg-pink-500 hover:bg-pink-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold shadow transition"
      >
        {submitting ? "Posting..." : "Comment"}
      </button>
    </form>
  );
}

// PostList component with upvote and comment
function PostList({ posts, loading, user, onInteract }) {
  const [upvoting, setUpvoting] = useState({});
  const [commentingPostId, setCommentingPostId] = useState(null);
  const [comments, setComments] = useState({}); // { [postId]: [comments] }
  const [loadingComments, setLoadingComments] = useState({});

  async function handleUpvote(postId) {
    setUpvoting(prev => ({ ...prev, [postId]: true }));
    try {
      let body;
      if (user && user.id) {
        body = JSON.stringify({ isAnonymous: false, userId: user.id });
      } else {
        let pseudonym = localStorage.getItem("pseudonym");
        if (!pseudonym) {
          pseudonym = generatePseudonym();
          localStorage.setItem("pseudonym", pseudonym);
        }
        body = JSON.stringify({ isAnonymous: true, anonId: pseudonym });
      }

      const res = await fetch(`/api/posts/${postId}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Failed to upvote. Please try again.");
      } else if (onInteract) {
        onInteract();
      }
    } catch (e) {
      alert("Failed to upvote. Please try again.");
    }
    setUpvoting(prev => ({ ...prev, [postId]: false }));
  }

  async function fetchComments(postId) {
    setLoadingComments(prev => ({ ...prev, [postId]: true }));
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      const data = await res.json();
      if (Array.isArray(data.comments)) {
        // Comments are loaded and stored in state
        setComments(prev => ({ ...prev, [postId]: data.comments }));
      }
    } catch (e) {
      setComments(prev => ({ ...prev, [postId]: [] }));
    }
    setLoadingComments(prev => ({ ...prev, [postId]: false }));
  }

  function handleCommentToggle(postId) {
    if (commentingPostId === postId) {
      setCommentingPostId(null);
    } else {
      setCommentingPostId(postId);
      if (!comments[postId]) fetchComments(postId);
    }
  }

  function handleCommented(postId) {
    fetchComments(postId);
    if (onInteract) onInteract();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-pink-600 font-semibold">
        <svg className="animate-spin h-6 w-6 mr-4 text-pink-400" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4" fill="none"
          />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        Loading posts...
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="py-10 text-gray-500 text-center italic">
        No posts yet. Be the first to ask for a fix or beautification!
      </div>
    );
  }

  return (
      <div className="h-[70vh] overflow-y-auto pr-2">

    <ul className="space-y-8">
      {posts.map((post, idx) => {
        const isAnonymous = post.asAnonymous || (!post.author?.name && !post.pseudonym);
        const displayName =
          (!isAnonymous && post.author?.name)
            ? post.author.name
            : (post.pseudonym || "Anonymous");
        const avatarFallback = displayName
          .split(" ")
          .map(w => w[0])
          .join("")
          .substring(0, 2)
          .toUpperCase();

        // Sum upvotes for display
        const upvoteCount = (Array.isArray(post.upvotes) ? post.upvotes.length : 0)
          + (Array.isArray(post.anonUpvotes) ? post.anonUpvotes.length : 0);

        return (
          <li
            key={post._id || idx}
            className="bg-gradient-to-br from-white via-rose-50 to-rose-100 border border-rose-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 group"
          >
            <div className="flex items-center mb-2">
              <div className="w-11 h-11 rounded-full bg-rose-200 flex items-center justify-center text-rose-700 font-bold mr-4 text-xl shadow border border-rose-300">
                <span title={isAnonymous ? "Anonymous" : displayName}>{avatarFallback}</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-rose-700 text-lg">
                    {displayName}
                  </span>
                  {(!isAnonymous && user && post.author?.name === user.name) && (
                    <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-xs font-medium ml-2 shadow">
                      You
                    </span>
                  )}
                  {isAnonymous && (
                    <span className="text-xs text-gray-400">(Anonymous)</span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {new Date(post.createdAt || Date.now()).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="text-gray-900 text-base mt-2 whitespace-pre-wrap font-medium">
              {post.content}
            </div>
            <div className="flex items-center mt-6 space-x-6">
              <button
                className={`flex items-center space-x-1 px-4 py-1.5 rounded-full border-2 ${
                  upvoting[post._id] ? "bg-rose-100 cursor-wait" : "bg-white hover:bg-rose-50"
                } border-rose-200 text-rose-700 font-semibold shadow-sm transition`}
                disabled={upvoting[post._id]}
                onClick={() => handleUpvote(post._id)}
                title="Upvote this post"
              >
                <svg className="w-5 h-5 fill-rose-500" viewBox="0 0 20 20">
                  <path d="M10 3l6 9H4l6-9zm0 3.236L6.618 10h6.764L10 6.236z"/>
                  <rect x="4" y="14" width="12" height="2" rx="1" className="fill-rose-200"/>
                </svg>
                <span className="ml-1">{upvoteCount}</span>
              </button>
              <button
                className="flex items-center text-pink-500 hover:text-pink-700 px-3 py-1 rounded-full bg-pink-50 hover:bg-pink-100 transition text-sm font-semibold shadow"
                onClick={() => handleCommentToggle(post._id)}
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 4V10a2 2 0 012-2h2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6m0 0L10 14l-3 3-4 1 1-4 3-3L21 9z" />
                </svg>
                Comment
              </button>
            </div>
            {/* Comments */}
            {commentingPostId === post._id && (
              <div className="mt-5 bg-white border border-rose-100 rounded-xl p-4 shadow-inner">
                <CommentForm
                  postId={post._id}
                  user={user}
                  onComment={() => handleCommented(post._id)}
                />
                <div className="mt-3">
                  {loadingComments[post._id] ? (
                    <div className="text-pink-400 text-sm">Loading comments...</div>
                  ) : (
                    <ul className="space-y-2">
                      {(comments[post._id] || []).length === 0 ? (
                        <li className="text-gray-400 text-sm italic">No comments yet.</li>
                      ) : (
                        comments[post._id].map((c, i) => (
                          <li key={c._id || i} className="bg-rose-50 rounded px-3 py-2 text-sm shadow-sm">
                            <span className="font-semibold text-rose-600">
                              {c.author?.name || "Anonymous"}
                            </span>
                            <span className="mx-2 text-gray-400">·</span>
                            <span className="text-gray-400">{new Date(c.createdAt || Date.now()).toLocaleString()}</span>
                            <div className="mt-1 text-gray-800 text-sm">{c.content}</div> {/* Small text size for comments */}
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
    </div>
  );
}