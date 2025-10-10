'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ComplaintInputPage() {
  const [complaintId, setComplaintId] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (complaintId.trim() === '') return;
    router.push(`/complaints/${complaintId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-pink-600 mb-6 text-center ">
          Enter Complaint ID
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="e.g. SHC-2025-7733"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            className="w-full border text-black border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
          />
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            View Complaint
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Enter the Complaint ID you received after submission to view its status.
        </p>
      </div>
    </div>
  );
}
