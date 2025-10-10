"use client";

import { useEffect, useState, useCallback } from "react";

const STATUS_OPTIONS = ["Pending", "Contacted", "Closed"];

export default function OfficerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Function to fetch all requests
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/requests");
      if (res.status === 401 || res.status === 403) {
         throw new Error("Unauthorized access. Check Officer role.");
      }
      if (!res.ok) {
         throw new Error("Failed to fetch requests data.");
      }
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(err.message);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Function to update the status of a request
  const handleStatusUpdate = async (requestId, newStatus) => {
    const originalRequests = requests;
    
    // Optimistic UI Update: Update the UI immediately
    setRequests(requests.map(r => 
      r._id === requestId ? { ...r, status: newStatus } : r
    ));

    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        // Rollback UI update on failure
        setRequests(originalRequests);
        alert("Failed to update status. Server error.");
        // Re-fetch to sync data
        fetchRequests(); 
      }
    } catch (error) {
      console.error("Error updating request status:", error);
      setRequests(originalRequests); // Rollback
      alert("A network error occurred while updating status.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
        case 'Pending': 
          return 'bg-gradient-to-r from-[#f7e1ff] to-[#ffd9e8] text-[#8B0000] border-[#ffd9e8]';
        case 'Contacted': 
          return 'bg-gradient-to-r from-[#ffe6f0] to-[#f7e1ff] text-[#8B0000] border-[#f7e1ff]';
        case 'Closed': 
          return 'bg-gradient-to-r from-[#ffd9e8] to-[#ffe6f0] text-gray-800 border-[#ffe6f0]';
        default: 
          return 'bg-[#ffe6f0] text-gray-500 border-[#ffd9e8]';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return '⏳';
      case 'Contacted': return '📞';
      case 'Closed': return '✅';
      default: return '📋';
    }
  };

  // Filter and search functionality
  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === "All" || request.status === filter;
    const matchesSearch = searchTerm === "" || 
      request.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.targetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatsCount = (status) => {
    return requests.filter(r => status === "All" ? true : r.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffe6f0] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-3 border-[#EA2264] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Loading Dashboard</h2>
            <p className="text-gray-800 font-medium">Fetching requests...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#ffe6f0] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 bg-[#ffd9e8] rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Error</h2>
            <p className="text-[#8B0000] font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffe6f0]">
      {/* Header Section */}
      <div className="px-6 py-12 mt-[6vh]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-wide">
              LEGAL AND COUNSELLOR AID
            </h3>
            <p className="text-lg text-gray-800 font-medium">
              Manage and track professional consultation requests
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {["All", ...STATUS_OPTIONS].map((status) => (
              <div
                key={status}
                className={`bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300 hover:shadow-md cursor-pointer ${
                  filter === status ? 'border-[#EA2264] shadow-md' : 'border-[#ffd9e8]/50'
                }`}
                onClick={() => setFilter(status)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">
                      {status} Requests
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {getStatsCount(status)}
                    </p>
                  </div>
                  <div className="text-2xl">
                    {status === "All" ? "📊" : getStatusIcon(status)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ffd9e8]/50 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Search Requests
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by requester, professional, or subject..."
                  className="w-full p-3 border text-gray-400 placeholder-gray-700 border-[#ffd9e8] rounded-xl focus:ring-2 focus:ring-[#EA2264]/20 focus:border-[#EA2264] outline-none transition-all duration-200 bg-[#ffe6f0]/30"
                />
              </div>
              <div className="md:w-48">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Filter by Status
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full p-3 border text-gray-600 border-[#ffd9e8] rounded-xl focus:ring-2 focus:ring-[#EA2264]/20 focus:border-[#EA2264] outline-none transition-all duration-200 bg-white"
                >
                  <option value="All">All Statuses</option>
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Requests Table */}
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-[#ffd9e8]/50 text-center">
              <div className="w-20 h-20 bg-[#f7e1ff] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || filter !== "All" ? "No matching requests found" : "No requests found"}
              </h3>
              <p className="text-gray-800 font-medium">
                {searchTerm || filter !== "All" ? "Try adjusting your search or filter criteria." : "New requests will appear here."}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-[#ffd9e8]/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#ffd9e8]/50">
                  <thead className="bg-[#ffe6f0]/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Requester
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Professional
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Requested On
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#ffd9e8]/30">
                    {filteredRequests.map((request, index) => (
                      <tr 
                        key={request._id} 
                        className={`hover:bg-[#ffe6f0]/30 transition-colors duration-200 animate-table-row`}
                        style={{
                          '--animation-delay': `${index * 50}ms`
                        }}
                      >
                        {/* Requester Details */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#f7e1ff] to-[#ffd9e8] rounded-full flex items-center justify-center">
                              <span className="text-[#8B0000] text-sm font-bold">
                                {(request.userEmail || request.userName || 'U')?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {request.userEmail || 'N/A'}
                              </div>
                              <div className="text-sm font-medium text-gray-800">
                                {request.userName || request.userId}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Professional Details */}
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {request.targetName}
                            </div>
                            <div className="text-xs font-medium text-gray-800">
                              {request.targetEmail}
                            </div>
                          </div>
                        </td>

                        {/* Subject */}
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs">
                            <div className="truncate" title={request.subject}>
                              {request.subject}
                            </div>
                          </div>
                        </td>

                        {/* Status Display */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(request.status)}`}>
                            <span className="mr-1">{getStatusIcon(request.status)}</span>
                            {request.status}
                          </span>
                        </td>

                        {/* Timestamp */}
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {new Date(request.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>

                        {/* Action/Status Update */}
                        <td className="px-6 py-4">
                          <select
                            value={request.status}
                            onChange={(e) => handleStatusUpdate(request._id, e.target.value)}
                            className="block w-full font-medium text-gray-900 py-2 px-3 border border-[#ffd9e8] bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EA2264]/20 focus:border-[#EA2264] text-sm transition-all duration-200"
                          >
                            {STATUS_OPTIONS.map(status => (
                              <option key={status} value={status}>
                                {getStatusIcon(status)} {status}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-table-row {
          animation-name: fadeInUp;
          animation-duration: 0.4s;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
          animation-delay: var(--animation-delay);
          opacity: 0;
        }

        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
}