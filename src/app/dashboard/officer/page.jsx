"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import ComplaintChat from "@/components/ComplaintChat";

const STATUS_OPTIONS = [
  "PENDING",
  "IN_PROGRESS",
  "RESOLVED",
  "REJECTED",
];

const TYPE_OPTIONS = [
  "VERBAL",
  "PHYSICAL",
  "ONLINE",
  "WORKPLACE",
  "OTHER",
];

export default function OfficerDashboardPage() {
  const { data: session, isPending, error } = authClient.useSession();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [q, setQ] = useState("");
  const [activeComplaintId, setActiveComplaintId] = useState(null);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (type) params.append("type", type);
    if (q) params.append("q", q);

    fetch(`/api/complaints/officer?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setComplaints(data.items);
        setLoading(false);
      });
  }, [session, status, type, q]);

  const updateStatus = async (complaintId, newStatus) => {
    const res = await fetch("/api/complaints/officer", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ complaintId, status: newStatus }),
    });
    const data = await res.json();
    if (data.success) {
      setComplaints((prev) =>
        prev.map((c) => c.complaintId === complaintId ? { ...c, status: newStatus } : c)
      );
    } else {
      alert("Error updating status.");
    }
  };

  if (isPending) {
    return <div className="p-10 text-center">Loading...</div>;
  }
  if (error) {
    return <div className="p-10 text-center text-red-700">Error: {error.message}</div>;
  }
  if (!session) {
    return (
      <div className="p-10 text-center text-gray-500">
        Please sign in to view the officer dashboard.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-pink-700">Officer Dashboard</h1>
      <div className="mb-6 flex flex-wrap gap-4">
        <select value={status} onChange={e => setStatus(e.target.value)} className="border px-3 py-2 rounded">
          <option value="">All Status</option>
          {STATUS_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
        </select>
        <select value={type} onChange={e => setType(e.target.value)} className="border px-3 py-2 rounded">
          <option value="">All Types</option>
          {TYPE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
        </select>
        <input
          type="text"
          placeholder="Search by email or ID"
          value={q}
          onChange={e => setQ(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>

      {loading ? (
        <div>Loading complaints...</div>
      ) : (
        <>
          {complaints.length === 0 ? (
            <div className="text-center text-gray-500">No complaints found.</div>
          ) : (
            <table className="w-full table-auto mb-6 border">
              <thead>
                <tr className="bg-pink-100 text-pink-900">
                  <th className="p-2">ID</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                  <th className="p-2">Chat</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.complaintId}>
                    <td className="p-2">{c.complaintId}</td>
                    <td className="p-2">{c.email || "Anonymous"}</td>
                    <td className="p-2">{c.incidentType}</td>
                    <td className="p-2">{c.incidentDate}</td>
                    <td className="p-2">{c.status || "PENDING"}</td>
                    <td className="p-2">
                      <select
                        value={c.status || "PENDING"}
                        onChange={(e) => updateStatus(c.complaintId, e.target.value)}
                        className="border px-2 py-1 rounded"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <button
                        className="text-blue-600 underline"
                        onClick={() => setActiveComplaintId(c.complaintId)}
                      >
                        Chat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeComplaintId && (
            <ComplaintChat
              complaintId={activeComplaintId}
              userRole="officer"
              userName={session.user?.name || "Officer"}
              onClose={() => setActiveComplaintId(null)}
            />
          )}
        </>
      )}
    </div>
  );
}