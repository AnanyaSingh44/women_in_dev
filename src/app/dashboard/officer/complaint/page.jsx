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

const PRIORITY_OPTIONS = [
  "LOW",
  "MEDIUM",
  "HIGH",
];

const STATUS_COLORS = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
  RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
};

function ComplaintModal({ complaint, onClose, onStatusChange, onPriorityChange, chatUserName }) {
  if (!complaint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-fadeInUp">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Complaint Details</h2>
            <p className="text-sm text-gray-500 mt-0.5">ID: {complaint.complaintId}</p>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</label>
                <p className="mt-1 text-sm text-gray-900">{complaint.incidentType}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                <p className="mt-1 text-sm text-gray-900">{complaint.email || "Anonymous"}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</label>
                <p className="mt-1 text-sm text-gray-900">{complaint.incidentLocation}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date</label>
                <p className="mt-1 text-sm text-gray-900">{complaint.incidentDate}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Status</label>
                <select
                  className="w-full border border-gray-200 text-gray-500 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  value={complaint.status || "PENDING"}
                  onChange={e => onStatusChange(complaint.complaintId, e.target.value)}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Priority</label>
                <select
                  className="w-full border border-gray-200 px-3 py-2 text-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  value={complaint.priority || "LOW"}
                  onChange={e => onPriorityChange(complaint.complaintId, e.target.value)}
                >
                  {PRIORITY_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt[0] + opt.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Description</label>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed border border-gray-100">
              {complaint.incidentDescription}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Communication Thread</h3>
            <ComplaintChat
              complaintId={complaint.complaintId}
              userRole="officer"
              userName={chatUserName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({ title, status, complaints, onStatusChange, onPriorityChange, openModal }) {
  return (
    <div className="flex-1 min-w-[300px] bg-white rounded-xl p-3 shadow-sm border border-gray-100 mx-2">
      <h2 className="text-lg font-bold text-gray-700 mb-3 text-center">{title}</h2>
      <div className="space-y-3">
        {complaints.length === 0 ? (
          <div className="text-center text-gray-400 py-6">No cases</div>
        ) : (
          complaints.map(c => (
            <div key={c.complaintId} className="bg-gray-50 rounded-lg p-3 shadow group hover:shadow-md border border-gray-100 transition">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">#{c.complaintId}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs border font-medium ${STATUS_COLORS[c.status] || STATUS_COLORS.PENDING}`}>
                  {(c.status || "PENDING").replace('_', ' ')}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {c.incidentType} | {c.incidentDate}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Priority: <span className={`font-bold ${c.priority === 'HIGH' ? 'text-red-500' : c.priority === 'MEDIUM' ? 'text-orange-500' : 'text-green-600'}`}>
                  {c.priority ? c.priority[0] + c.priority.slice(1).toLowerCase() : "Low"}
                </span>
              </div>
              <div className="flex items-center mt-2 gap-2">
                <select
                  className="border text-gray-700 border-gray-200 px-2 py-1 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={c.status || "PENDING"}
                  onChange={e => onStatusChange(c.complaintId, e.target.value)}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
                  ))}
                </select>
                <select
                  className="border text-gray-500 border-gray-200 px-2 py-1 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={c.priority || "LOW"}
                  onChange={e => onPriorityChange(c.complaintId, e.target.value)}
                >
                  {PRIORITY_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt[0] + opt.slice(1).toLowerCase()}</option>
                  ))}
                </select>
                <button
                  className="ml-auto text-pink-600 underline text-xs font-medium"
                  onClick={() => openModal(c.complaintId)}
                >
                  View & Chat
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function OfficerDashboardPage() {
  const { data: session, isPending, error } = authClient.useSession();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("");
  const [q, setQ] = useState("");
  const [activeComplaintId, setActiveComplaintId] = useState(null);
  const [viewKanban, setViewKanban] = useState(true);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (type) params.append("type", type);
    if (priority) params.append("priority", priority);
    if (q) params.append("q", q);

    fetch(`/api/officer?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setComplaints(Array.isArray(data.items) ? data.items : []);
        setLoading(false);
      })
      .catch(() => {
        setComplaints([]);
        setLoading(false);
      });
  }, [session, status, type, priority, q]);

  const updateStatus = async (complaintId, newStatus) => {
    const res = await fetch("/api/officer", {
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

  const updatePriority = async (complaintId, newPriority) => {
    const res = await fetch("/api/officer", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ complaintId, priority: newPriority }),
    });
    const data = await res.json();
    if (data.success) {
      setComplaints((prev) =>
        prev.map((c) => c.complaintId === complaintId ? { ...c, priority: newPriority } : c)
      );
    } else {
      alert("Error updating priority.");
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center ">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600">Please sign in to view the officer dashboard.</p>
        </div>
      </div>
    );
  }

  const activeComplaint = complaints.find(c => c.complaintId === activeComplaintId);

  // Group complaints by status for Kanban
  const kanbanColumns = STATUS_OPTIONS.map(statusOpt => ({
    status: statusOpt,
    title: statusOpt.replace('_', ' '),
    complaints: complaints.filter(c => c.status === statusOpt && (priority === "" || c.priority === priority))
  }));

  return (
    <div className="min-h-screen bg-[#ffe6f0] mt-[8vh]">
      <div className="max-w-9xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Officer Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">Manage and review harassment complaints</p>
          </div>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition text-sm ${viewKanban ? "bg-pink-600 text-white" : "bg-white border border-pink-600 text-pink-600"}`}
            onClick={() => setViewKanban(v => !v)}
          >
            {viewKanban ? "Table View" : "Kanban View"}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Status</label>
            <select 
              value={status} 
              onChange={e => setStatus(e.target.value)} 
              className="w-full border text-gray-500 border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>)}
            </select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Type</label>
            <select 
              value={type} 
              onChange={e => setType(e.target.value)} 
              className="w-full border text-gray-500 border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              {TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Priority</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
              className="w-full border text-gray-500 border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              {PRIORITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt[0] + opt.slice(1).toLowerCase()}</option>)}
            </select>
          </div>
          
          <div className="flex-1 min-w-[250px]">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Search</label>
            <input
              type="text"
              placeholder="Search by email or ID"
              value={q}
              onChange={e => setQ(e.target.value)}
              className="w-full text-gray-500 border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No complaints found</h3>
            <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        ) : viewKanban ? (
          <div className="flex gap-4 overflow-x-auto min-h-[60vh]">
            {kanbanColumns.map(col => (
              <KanbanColumn
                key={col.status}
                title={col.title}
                status={col.status}
                complaints={col.complaints}
                onStatusChange={updateStatus}
                onPriorityChange={updatePriority}
                openModal={setActiveComplaintId}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {complaints
                    .filter(c => priority === "" || c.priority === priority)
                    .map((c) => (
                    <tr key={c.complaintId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">#{c.complaintId}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{c.email || "Anonymous"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{c.incidentType}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{c.incidentDate}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[c.status] || STATUS_COLORS.PENDING}`}>
                          {(c.status || "PENDING").replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          className="border text-gray-500 border-gray-200 px-2 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          value={c.priority || "LOW"}
                          onChange={e => updatePriority(c.complaintId, e.target.value)}
                        >
                          {PRIORITY_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt[0] + opt.slice(1).toLowerCase()}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={c.status || "PENDING"}
                            onChange={(e) => updateStatus(c.complaintId, e.target.value)}
                            className="border text-gray-500 border-gray-200 px-2 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
                            ))}
                          </select>
                          <button
                            className="px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium rounded-lg transition-colors"
                            onClick={() => setActiveComplaintId(c.complaintId)}
                          >
                            View & Chat
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeComplaintId && (
          <ComplaintModal
            complaint={activeComplaint}
            onClose={() => setActiveComplaintId(null)}
            onStatusChange={updateStatus}
            onPriorityChange={updatePriority}
            chatUserName={session.user?.name || "Officer"}
          />
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}