'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ComplaintChat from "@/components/ComplaintChat";

export default function ComplaintPage() {
  const { id } = useParams(); // complaintId from URL
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchComplaint = async () => {
      try {
        const res = await fetch(`/api/complaints/${id}`);
        if (!res.ok) throw new Error('Complaint not found');
        const data = await res.json();
        setComplaint(data.complaint);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-white">
        <div className="text-xl text-gray-500 font-semibold animate-pulse">
          Loading...
        </div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-white">
        <div className="text-xl text-red-600 font-semibold">{error}</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-white py-10">
      <div className="max-w-2xl mx-auto  mt-[10vh] p-8 bg-white/90 border border-gray-200 rounded-3xl shadow-lg">
        <div className="flex items-center mb-8">
          <div className="bg-gradient-to-br from-pink-500 to-blue-400 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4 shadow">
            <span className="font-mono">{complaint.complaintId.split('-')[0]}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Complaint #{complaint.complaintId}
            </h1>
            <div className="text-xs text-gray-400">
              {new Date(complaint.incidentDate).toLocaleString()} &middot; {complaint.status}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <div className="mb-2">
              <span className="font-medium text-gray-600">Type: </span>
              <span className="text-blue-700">{complaint.incidentType}</span>
            </div>
            <div className="mb-2">
              <span className="font-medium text-gray-600">Location: </span>
              <span className="text-gray-700">{complaint.incidentLocation}</span>
            </div>
          </div>
          <div>
            <div className="mb-2">
              <span className="font-medium text-gray-600">Status: </span>
              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold
                ${complaint.status === 'Open'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'}
              `}>
                {complaint.status}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-medium text-gray-600">Date: </span>
              <span className="text-gray-700">
                {new Date(complaint.incidentDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <div className="font-semibold text-gray-700 mb-1">Description:</div>
          <div className="bg-gray-50 border rounded-lg p-4 text-gray-700 leading-relaxed shadow-sm">
            {complaint.incidentDescription}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-pink-600 mb-3">Investigation Chats</h2>
          <ComplaintChat
            complaintId={complaint.complaintId}
            userRole="public"
            userName="Anonymous"
          />
        </div>
      </div>
    </div>
  );
}