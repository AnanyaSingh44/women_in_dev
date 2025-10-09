"use client";
import { useEffect, useRef, useState } from "react";

export default function ComplaintChat({ complaintId, userRole, userName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?complaintId=${complaintId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [complaintId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setError("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaintId,
          sender: userRole,
          senderName: userName || (userRole === "officer" ? "Officer" : "Anonymous"),
          message: input.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to send");
      setInput("");
      fetchMessages();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="border rounded-lg p-4 max-w-lg mx-auto bg-white text-gray-600">
      <div className="h-64 overflow-y-auto mb-4 bg-gray-50 p-2 rounded">
        {loading ? (
          <div>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-gray-400 text-center">No messages yet.</div>
        ) : (
          messages.map((msg, i) => (
            <div key={msg._id || i} className={`mb-2 ${msg.sender === userRole ? "text-right" : "text-left"}`}>
              <div className={`inline-block px-3 py-2 rounded-xl ${msg.sender === userRole ? "bg-pink-100 text-pink-900" : "bg-gray-200 text-gray-700"}`}>
                <div className="text-xs text-gray-600">{msg.senderName}</div>
                <div>{msg.message}</div>
                <div className="text-[10px] text-gray-400">{new Date(msg.timestamp).toLocaleString()}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {error && <div className="text-red-600 text-xs mb-2">{error}</div>}
      <div className="flex gap-2">
        <input
          className="flex-1 border px-3 py-2 rounded"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-pink-600 text-white px-4 py-2 rounded"
          onClick={sendMessage}
          disabled={!input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}