"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function IdentityComplaintForm() {
  const { data: session, isPending, error } = authClient.useSession();

  const [formData, setFormData] = useState({
    incidentType: "",
    incidentDescription: "",
    incidentDate: "",
    incidentTime: "",
    incidentLocation: "",
    accusedName: "",
    accusedPosition: "",
    organization: "",
    witnesses: "",
    previousIncidents: "",
    emotionalState: "",
    needImmediateHelp: false,
    attachments: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "#EA2264", borderTopColor: "transparent" }}
          ></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-red-600 text-xl">⚠</span>
          </div>
          <p className="text-red-800 font-semibold">Error loading user session</p>
          <p className="text-red-600 text-sm mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const user = session?.user;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      alert("You must be logged in to submit an identity complaint.");
      setIsSubmitting(false);
      return;
    }

    const complaintId = `SHC-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const payload = {
      ...formData,
      isAnonymous: false,
      complaintId,
      userId: user.id,
      fullName: user.name,
      email: user.email,
    };

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Complaint submitted successfully! Your ID: ${data.complaintId}`);
        setFormData({
          incidentType: "",
          incidentDescription: "",
          incidentDate: "",
          incidentTime: "",
          incidentLocation: "",
          accusedName: "",
          accusedPosition: "",
          organization: "",
          witnesses: "",
          previousIncidents: "",
          emotionalState: "",
          needImmediateHelp: false,
          attachments: "",
        });
      } else {
        alert("Error submitting complaint. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-gray-500"
      style={{
        background: "linear-gradient(to bottom right, #ffe6f0, #ffd9e8, #f7e1ff)",
      }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-pink-100">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(to bottom right, #EA2264, #640D5F)",
              }}
            >
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2" style={{ color: "#640D5F" }}>
                Complaint Form
              </h2>
              <p className="text-gray-600">
                Your complaint will be handled with confidentiality and care
              </p>
            </div>
          </div>

          {/* User Info Badge */}
          <div
            className="mt-6 p-4 rounded-xl border"
            style={{
              background:
                "linear-gradient(to right, rgba(234, 34, 100, 0.05), rgba(247, 141, 96, 0.05))",
              borderColor: "rgba(234, 34, 100, 0.2)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(to bottom right, #EA2264, #F78D60)" }}
              >
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <p className="font-semibold" style={{ color: "#640D5F" }}>
                  {user?.name}
                </p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-pink-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Incident Type */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#640D5F" }}
              >
                Incident Type <span className="text-red-500">*</span>
              </label>
              <select
                name="incidentType"
                value={formData.incidentType}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200"
                style={{ "--tw-ring-color": "#EA2264" }}
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
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#640D5F" }}
              >
                Incident Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="incidentDescription"
                value={formData.incidentDescription}
                onChange={handleChange}
                minLength={20}
                required
                placeholder="Please describe what happened in detail..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200 resize-none"
                rows={5}
                style={{ "--tw-ring-color": "#EA2264" }}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.incidentDescription.length} characters
              </p>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#640D5F" }}
                >
                  Incident Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="incidentDate"
                  value={formData.incidentDate}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{ "--tw-ring-color": "#EA2264" }}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#640D5F" }}
                >
                  Incident Time
                </label>
                <input
                  type="time"
                  name="incidentTime"
                  value={formData.incidentTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{ "--tw-ring-color": "#EA2264" }}
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#640D5F" }}
              >
                Location
              </label>
              <input
                type="text"
                name="incidentLocation"
                placeholder="Where did this incident occur?"
                value={formData.incidentLocation}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200"
                style={{ "--tw-ring-color": "#EA2264" }}
              />
            </div>

            {/* Accused Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#640D5F" }}
                >
                  Accused Name
                </label>
                <input
                  type="text"
                  name="accusedName"
                  placeholder="Full name"
                  value={formData.accusedName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{ "--tw-ring-color": "#EA2264" }}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#640D5F" }}
                >
                  Accused Position
                </label>
                <input
                  type="text"
                  name="accusedPosition"
                  placeholder="Position/Role"
                  value={formData.accusedPosition}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{ "--tw-ring-color": "#EA2264" }}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#640D5F" }}
                >
                  Organization
                </label>
                <input
                  type="text"
                  name="organization"
                  placeholder="Organization/Department"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{ "--tw-ring-color": "#EA2264" }}
                />
              </div>
            </div>

            {/* Witnesses */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#640D5F" }}
              >
                Witnesses
              </label>
              <input
                type="text"
                name="witnesses"
                placeholder="Names of witnesses (comma-separated)"
                value={formData.witnesses}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200"
                style={{ "--tw-ring-color": "#EA2264" }}
              />
            </div>

            {/* Previous Incidents */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#640D5F" }}
              >
                Previous Incidents
              </label>
              <textarea
                name="previousIncidents"
                placeholder="Any similar incidents before?"
                value={formData.previousIncidents}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200 resize-none"
                style={{ "--tw-ring-color": "#EA2264" }}
                rows={3}
              />
            </div>

            {/* Emotional State */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#640D5F" }}
              >
                Current Emotional State
              </label>
              <select
                name="emotionalState"
                value={formData.emotionalState}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200"
                style={{ "--tw-ring-color": "#EA2264" }}
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
            <div
              className="p-4 rounded-xl border"
              style={{
                background:
                  "linear-gradient(to right, rgba(234, 34, 100, 0.03), rgba(247, 141, 96, 0.03))",
                borderColor: "rgba(234, 34, 100, 0.15)",
              }}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="needImmediateHelp"
                  checked={formData.needImmediateHelp}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 rounded border-gray-300 cursor-pointer"
                  style={{ accentColor: "#EA2264" }}
                />
                <div>
                  <span className="font-semibold block" style={{ color: "#640D5F" }}>
                    I need immediate help
                  </span>
                  <span className="text-sm text-gray-600">
                    Check this if you're in urgent need of assistance or support
                  </span>
                </div>
              </label>
            </div>

            {/* Attachments */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#640D5F" }}
              >
                Attachments
              </label>
              <input
                type="text"
                name="attachments"
                placeholder="URLs to supporting documents or evidence"
                value={formData.attachments}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200"
                style={{ "--tw-ring-color": "#EA2264" }}
              />
              <p className="text-xs text-gray-500 mt-1">
                You can add links to files stored in cloud storage
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ background: "linear-gradient(to right, #EA2264, #640D5F, #F78D60)" }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </span>
              ) : (
                "Submit Complaint"
              )}
            </button>

            {/* Privacy */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                🔒 Your information is confidential and will be handled with utmost care
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
