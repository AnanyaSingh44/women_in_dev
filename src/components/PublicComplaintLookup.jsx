"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PublicComplaintLookup() {
  const [showLookup, setShowLookup] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchComplaint = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/complaints/${complaintId}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Not found");
      // Navigate to the new page if found
      router.push(`/complaints/${complaintId}`);
    } catch (err) {
      setError(err.message || "Not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-16 p-6 bg-white border rounded shadow">
      <button
        className="mb-6 bg-gray-900 text-white px-4 py-2 rounded"
        onClick={() => setShowLookup((show) => !show)}
      >
        {showLookup ? "Hide Complaint Lookup" : "Show Complaint Lookup"}
      </button>
      {showLookup && (
        <>
          <h2 className="text-xl font-semibold mb-4">Complaint Lookup</h2>
          <div className="flex gap-2 mb-4">
            <input
              className="border px-3 py-2 rounded w-full"
              placeholder="Enter your Complaint ID"
              value={complaintId}
              onChange={e => setComplaintId(e.target.value)}
              onKeyDown={e => e.key === "Enter" && fetchComplaint()}
            />
            <button
              className="bg-gray-900 text-white px-4 py-2 rounded"
              onClick={fetchComplaint}
              disabled={!complaintId}
            >
              Lookup
            </button>
          </div>
          {loading && <div className="text-gray-500">Checking...</div>}
          {error && <div className="text-red-600">{error}</div>}
        </>
      )}
    </div>
  );
}