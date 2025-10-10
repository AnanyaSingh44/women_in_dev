'use client';

import { useState } from 'react';

// New component for the Toast notification
const ComplaintToast = ({ id, onClose }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(id).then(() => {
      alert('Complaint ID copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
      alert('Failed to copy ID. Please copy it manually: ' + id);
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-gray-800 text-white rounded-lg shadow-xl max-w-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="font-semibold text-sm mb-1">Complaint Submitted Successfully!</p>
          <p className="text-xs">
            Your anonymous Complaint ID is:
          </p>
          <div className="flex items-center mt-2 bg-gray-700 p-2 rounded">
            <span className="font-mono text-sm mr-2 select-all break-all">{id}</span>
            <button
              onClick={handleCopy}
              className="ml-auto flex-shrink-0 text-xs px-2 py-1 bg-gray-600 rounded hover:bg-gray-500 transition-colors"
            >
              Copy ID
            </button>
          </div>
          <p className="text-xs mt-2 text-yellow-300">
            **Please copy this ID to track your complaint.**
          </p>
        </div>
        <button onClick={onClose} className="ml-4 text-gray-400 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};


export default function AnonymousComplaintFormToggle() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for the Toast notification
  const [toastId, setToastId] = useState(null); 

  const [formData, setFormData] = useState({
    incidentType: '',
    incidentDescription: '',
    incidentDate: '',
    incidentTime: '',
    incidentLocation: '',
    accusedName: '',
    accusedPosition: '',
    organization: '',
    witnesses: '',
    previousIncidents: '',
    emotionalState: '',
    needImmediateHelp: false,
    attachments: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({
      incidentType: '',
      incidentDescription: '',
      incidentDate: '',
      incidentTime: '',
      incidentLocation: '',
      accusedName: '',
      accusedPosition: '',
      organization: '',
      witnesses: '',
      previousIncidents: '',
      emotionalState: '',
      needImmediateHelp: false,
      attachments: '',
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const complaintId = `SHC-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const payload = { ...formData, isAnonymous: true, complaintId };

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Check for success status code (200-299)
      if (res.ok) {
        // Assuming your API returns { success: true, complaintId: "..." }
        const data = await res.json(); 

        // 1. Show Toast Notification with the ID
        setToastId(data.complaintId || complaintId);
        
        // Hide the toast after 15 seconds (optional)
        setTimeout(() => setToastId(null), 15000); 

        // 2. Reset Form and hide
        resetForm();
        setShowForm(false);
        
      } else {
        // Handle non-200 status codes (e.g., 400 Bad Request, 500 Server Error)
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
        alert(`Error submitting complaint: ${errorData.message || res.statusText}`);
      }
    } catch (err) {
      console.error(err);
      alert('Server error. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh]  flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        {!showForm && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="bg-gray-900 text-white text-sm font-medium px-6 py-3 rounded hover:bg-gray-800 transition-colors"
            >
              File Anonymous Complaint
            </button>
          </div>
        )}

        {/* Form Card (rest of the form remains the same) */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* ... Form Header and Close button ... */}
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Anonymous Complaint Form
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    All fields marked with * are required
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Incident Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Type <span className="text-red-600">*</span>
                </label>
                <select
                  name="incidentType"
                  value={formData.incidentType}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                >
                  <option value="">Select incident type</option>
                  <option value="VERBAL">Verbal Harassment</option>
                  <option value="PHYSICAL">Physical Harassment</option>
                  <option value="ONLINE">Online/Cyber Harassment</option>
                  <option value="WORKPLACE">Workplace Harassment</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="incidentDescription"
                  value={formData.incidentDescription}
                  onChange={handleChange}
                  minLength={20}
                  required
                  rows={5}
                  placeholder="Please describe what happened in detail (minimum 20 characters)..."
                  className="w-full border border-gray-300 px-3 py-2 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.incidentDescription.length} characters</p>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Incident Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    name="incidentDate"
                    value={formData.incidentDate}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Incident Time
                  </label>
                  <input
                    type="time"
                    name="incidentTime"
                    value={formData.incidentTime}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="incidentLocation"
                  value={formData.incidentLocation}
                  onChange={handleChange}
                  placeholder="Where did this incident occur?"
                  className="w-full border border-gray-300 px-3 py-2 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                />
              </div>

              {/* Accused Details */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Accused Information (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="accusedName"
                      value={formData.accusedName}
                      onChange={handleChange}
                      placeholder="Name of accused"
                      className="w-full border border-gray-300 px-3 py-2 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occupation
                    </label>
                    <input
                      type="text"
                      name="accusedPosition"
                      value={formData.accusedPosition}
                      onChange={handleChange}
                      placeholder="Position/Title"
                      className="w-full border border-gray-300 px-3 py-2 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="Organization name"
                      className="w-full border border-gray-300 px-3 py-2 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Witnesses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Witnesses
                </label>
                <input
                  type="text"
                  name="witnesses"
                  value={formData.witnesses}
                  onChange={handleChange}
                  placeholder="Names of witnesses (comma-separated)"
                  className="w-full border border-gray-300 px-3 py-2 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                />
              </div>

              {/* Previous Incidents */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Incidents
                </label>
                <textarea
                  name="previousIncidents"
                  value={formData.previousIncidents}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Have there been similar incidents before? Please describe..."
                  className="w-full border border-gray-300 px-3 py-2 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 resize-none"
                />
              </div>

              {/* Emotional State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Emotional State<span>*</span>
                </label>
                <select
                  name="emotionalState"
                  value={formData.emotionalState}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                >
                  <option value="">How are you feeling?</option>
                  <option value="SCARED">Scared/Fearful</option>
                  <option value="ANXIOUS">Anxious/Worried</option>
                  <option value="ANGRY">Angry/Frustrated</option>
                  <option value="CALM">Calm/Composed</option>
                  <option value="CONFUSED">Confused/Uncertain</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Immediate Help */}
              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="needImmediateHelp"
                    checked={formData.needImmediateHelp}
                    onChange={handleChange}
                    className="mt-0.5 w-4 h-4 border-gray-300 rounded"
                    style={{ accentColor: '#1f2937' }}
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      I need immediate help
                    </span>
                    <span className="text-xs text-gray-600">
                      Check this if you're in urgent need of assistance
                    </span>
                  </div>
                </label>
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments
                </label>
                <input
                  type="text"
                  name="attachments"
                  value={formData.attachments}
                  onChange={handleChange}
                  placeholder="URLs to supporting documents (comma-separated)"
                  className="w-full border border-gray-300 px-3 py-2 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can add links to files stored in cloud storage
                </p>
              </div>

              {/* Submit Button */}
              <div className="border-t border-gray-200 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-900 text-white text-sm font-medium px-4 py-3 rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Anonymous Complaint'
                  )}
                </button>
                
                <p className="text-center text-xs text-gray-600 mt-4">
                  Your information is confidential. If you wish to reveal your identity for follow-up,{' '}
                  <a href="/signup" className="text-gray-900 underline hover:no-underline">
                    create an account
                  </a>
                  .
                </p>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* RENDER THE TOAST */}
      {toastId && (
        <ComplaintToast id={toastId} onClose={() => setToastId(null)} />
      )}
    </div>
  );
}