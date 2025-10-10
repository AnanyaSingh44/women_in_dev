"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Directory() {
  const [people, setPeople] = useState([]);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [peopleLoading, setPeopleLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect 1: Fetch session data and normalize user ID
  useEffect(() => {
    const fetchSession = async () => {
      setAuthLoading(true);
      try {
        const { data: session, error } = await authClient.getSession();

        if (error) {
          console.error("Auth session error:", error);
          setUser(null);
        } else {
          const sessionUser = session?.user || null;
          if (sessionUser) {
            const normalizedUser = {
              ...sessionUser,
              _id: sessionUser._id || sessionUser.id,
            };
            setUser(normalizedUser);
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Error fetching session:", err);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    fetchSession();
  }, []);

  // useEffect 2: Fetch counsellor data
  useEffect(() => {
    const fetchPeople = async () => {
      setPeopleLoading(true);
      try {
        const res = await fetch("/api/counsellors");
        if (!res.ok) throw new Error("Failed to fetch people");
        const data = await res.json();
        setPeople(data);
      } catch (err) {
        console.error(err);
      } finally {
        setPeopleLoading(false);
      }
    };
    fetchPeople();
  }, []);

  // Open modal
  const openModal = (target) => {
    setSelectedTarget(target);
    setSubject("");
    setMessage("");
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTarget(null);
    setSubject("");
    setMessage("");
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      alert("Please fill out all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          targetId: selectedTarget._id,
          targetEmail: selectedTarget.email,
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Request sent successfully!");
        closeModal();
      } else {
        alert("Failed: " + (data.error || data.message));
      }
    } catch (err) {
      console.error(err);
      alert("Error sending request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#ffe6f0] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-12 h-12 border-3 border-[#EA2264] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div>
            <h1 className="text-3xl font-light text-gray-800 mb-2">Counsellors & Lawyers</h1>
            <p className="text-gray-600">Checking authentication status...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffe6f0] mt-[8vh]">
      {/* Header Section */}
      <div className="px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-4 tracking-wide">
          Counsellors & Lawyers
        </h1>
        <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
          Connect with experienced professionals who can guide you through your journey
        </p>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-16">
        {peopleLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-3 border-[#EA2264] border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-gray-600 text-lg font-light">Loading directory...</p>
          </div>
        ) : people.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#ffd9e8] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-light text-gray-700 mb-2">No professionals found</h3>
            <p className="text-gray-500 font-light">Please check back later.</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {people.map((person, index) => (
                <div
                  key={person._id}
                  className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-[#ffd9e8]/50 hover:border-[#EA2264]/20"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#f7e1ff] to-[#ffd9e8] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-105 transition-transform duration-300">
                    <span className="text-[#EA2264] text-xl font-medium">
                      {person.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-center space-y-4">
                    <h2 className="text-xl font-medium text-gray-800">
                      {person.name}
                    </h2>
                    <div className="flex justify-center items-center gap-1 mt-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-sm ${i < (person.rating || 0) ? 'text-yellow-400' : 'text-yellow-400'}`}>★</span>
      ))}
    </div>
                    <div className="inline-flex items-center">
                      <span className="bg-[#f7e1ff] text-[#EA2264] px-4 py-2 rounded-full text-sm font-medium capitalize">
                        {person.role}
                      </span>
                    </div>

                    {user ? (
                      <button
                        onClick={() => openModal(person)}
                        className="w-full bg-[#EA2264] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#EA2264]/90 transition-all duration-300 hover:shadow-md"
                      >
                        Request to Contact
                      </button>
                    ) : (
                      <a
                        href="/auth/signIn"
                        className="block w-full text-center bg-[#ffd9e8] text-[#EA2264] px-6 py-3 rounded-xl font-medium hover:bg-[#f7e1ff] transition-all duration-300 border border-[#ffd9e8]"
                      >
                        Login to Contact →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 relative animate-scaleIn border border-[#ffd9e8]/50">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 w-8 h-8 bg-[#ffe6f0] rounded-full flex items-center justify-center text-gray-600 hover:bg-[#ffd9e8] transition-colors duration-200"
              disabled={isSubmitting}
            >
              <span className="text-sm">✕</span>
            </button>

            {/* Modal Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#f7e1ff] to-[#ffd9e8] rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-[#EA2264] text-xl font-medium">
                  {selectedTarget?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <h2 className="text-2xl font-light text-gray-800 mb-2">
                Send Request
              </h2>
              <p className="text-gray-600 font-light">
                to <span className="font-medium text-[#EA2264]">{selectedTarget?.name}</span>
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter your subject..."
                  className="w-full p-4 border text-gray-600 border-[#ffd9e8] rounded-xl focus:ring-2 focus:ring-[#EA2264]/20 focus:border-[#EA2264] outline-none transition-all duration-200 bg-[#ffe6f0]/30"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  className="w-full p-4 border text-gray-600 border-[#ffd9e8] rounded-xl focus:ring-2 focus:ring-[#EA2264]/20 focus:border-[#EA2264] outline-none resize-none transition-all duration-200 bg-[#ffe6f0]/30"
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !subject.trim() || !message.trim()}
                className="w-full bg-[#EA2264] text-white py-4 rounded-xl font-medium hover:bg-[#EA2264]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : (
                  'Send Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }

        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
}