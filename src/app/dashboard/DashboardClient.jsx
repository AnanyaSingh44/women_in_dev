'use client';

import { useState, useEffect } from 'react';
import IdentityComplaintForm from '@/components/IdentityComplaintForm';

export default function DashboardClient({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
    const [expandedComplaintId, setExpandedComplaintId] = useState(null);


  // Fetch user's complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/complaints/user'); // dedicated route
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        setComplaints(data.success ? data.complaints || [] : []);
      } catch (err) {
        console.error('Error fetching complaints:', err);
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchComplaints();
  }, [user?.id]);

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'text-amber-700 bg-amber-50 border-amber-200',
      IN_PROGRESS: 'text-blue-700 bg-blue-50 border-blue-200',
      RESOLVED: 'text-green-700 bg-green-50 border-green-200',
      REJECTED: 'text-gray-700 bg-gray-50 border-gray-200',
    };
    return colors[status] || 'text-gray-700 bg-gray-50 border-gray-200';
  };

  return (
    <div className="min-h-[90vh] bg-[#ffd9e8] mt-[8vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                Complaint Portal
              </h1>
              <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Cases</p>
              <p className="text-2xl font-semibold text-gray-900">{complaints.length}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {['overview', 'new', 'status'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-gray-900 bg-gray-50 border-b-2 border-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab === 'overview'
                  ? 'Overview'
                  : tab === 'new'
                  ? 'New Complaint'
                  : 'My Complaints'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map((status) => (
                  <div key={status} className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                      {status.replace('_', ' ')}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {complaints.filter((c) => c.status === status).length}
                    </p>
                  </div>
                ))}
              </div>

              {/* Recent Complaints */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Complaints</h2>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-sm text-gray-600">Loading...</p>
                    </div>
                  ) : complaints.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-4">No complaints filed yet</p>
                      <button
                        onClick={() => setActiveTab('new')}
                        className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                      >
                        File Complaint
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {complaints.slice(0, 5).map((complaint) => (
                        <div
                          key={complaint._id || complaint.complaintId}
                          className="p-4 border border-gray-200 rounded hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(
                                    complaint.status
                                  )}`}
                                >
                                  {complaint.status.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-gray-500">{complaint.complaintId}</span>
                              </div>
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                {complaint.incidentType}
                              </p>
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {complaint.incidentDescription}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* New Complaint Tab */}
          {activeTab === 'new' && <IdentityComplaintForm />}

          {/* My Complaints Tab */}
        {/* My Complaints Tab */}
          {activeTab === 'status' && (
            <div className="bg-white border border-gray-200 rounded-lg text-gray-500">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">All Complaints</h2>
                <span className="text-sm text-gray-600">{complaints.length} total</span>
              </div>
              <div className="p-6 space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm text-gray-600">Loading...</p>
                  </div>
                ) : complaints.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">No complaints found</p>
                    <button
                      onClick={() => setActiveTab('new')}
                      className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                    >
                      File Complaint
                    </button>
                  </div>
                ) : (
                  complaints.map((complaint) => {
                    const isExpanded = expandedComplaintId === (complaint._id || complaint.complaintId);
                    return (
                      <div
                        key={complaint._id || complaint.complaintId}
                        className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
                      >
                        {/* Status and URGENT badge */}
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                              complaint.status
                            )}`}
                          >
                            {complaint.status.replace('_', ' ')}
                          </span>
                          {complaint.needImmediateHelp && (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                              URGENT
                            </span>
                          )}
                        </div>

                        {/* Type, Complaint ID, Dates */}
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                          {complaint.incidentType}
                        </h3>
                        <p className="text-xs text-gray-500 mb-1">{complaint.complaintId}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 text-xs text-gray-500">
                          <div>
                            <span>Incident Date:&nbsp;</span>
                            <span className="text-gray-900">
                              {new Date(complaint.incidentDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                              {complaint.incidentTime && `, ${complaint.incidentTime}`}
                            </span>
                          </div>
                          <div>
                            <span>Filed On:&nbsp;</span>
                            <span className="text-gray-900">
                              {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                        {/* Description excerpt */}
                        <div className="mb-2">
                          <p className="text-xs text-gray-500">Description</p>
                          <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                            {complaint.incidentDescription.length > 120
                              ? complaint.incidentDescription.slice(0, 120) + '…'
                              : complaint.incidentDescription}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                          <button
                            className="text-xs font-medium text-gray-700 px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                            onClick={() =>
                              setExpandedComplaintId(isExpanded ? null : (complaint._id || complaint.complaintId))
                            }
                          >
                            {isExpanded ? "Hide Details" : "View Details"}
                          </button>
                        </div>
                        {isExpanded && (
                          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded">
                            <p className="text-xs text-gray-500 mb-2">
                              <span className="font-medium">Complaint ID:</span> {complaint.complaintId}
                            </p>
                            <p className="mb-3">
                              <span className="font-medium">Type:</span> {complaint.incidentType}
                            </p>
                            <p className="mb-3">
                              <span className="font-medium">Status:</span> {complaint.status}
                            </p>
                            <p className="mb-3">
                              <span className="font-medium">Incident Date:</span>{" "}
                              {new Date(complaint.incidentDate).toLocaleDateString()}{" "}
                              {complaint.incidentTime && `, ${complaint.incidentTime}`}
                            </p>
                            {complaint.incidentLocation && (
                              <p className="mb-3">
                                <span className="font-medium">Location:</span> {complaint.incidentLocation}
                              </p>
                            )}
                            <p className="mb-3">
                              <span className="font-medium">Description:</span> <br />
                              {complaint.incidentDescription}
                            </p>
                            {complaint.emotionalState && (
                              <p className="mb-3">
                                <span className="font-medium">Emotional State:</span> {complaint.emotionalState}
                              </p>
                            )}
                            {/* Add more fields if needed */}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
             )}
        </div>
      </div>
    </div>
  );
}
