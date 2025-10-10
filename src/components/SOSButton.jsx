"use client";

import { useState } from "react";
import toast from 'react-hot-toast'; // Import the toast function

export default function SOSButton({ isNavbar, isMobileMenu }) {
  const [loading, setLoading] = useState(false);
  // Remove local status state since we're using toasts
  // const [status, setStatus] = useState(""); 

  const triggerSOS = async () => {
    setLoading(true);
    // setStatus(""); // Not needed with toast
    console.log("SOS button clicked");

    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser.", { duration: 5000 });
      setLoading(false);
      return;
    }

    // Show a loading/in-progress toast immediately
    const loadingToast = toast.loading("Fetching location and sending alert...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // --- CRITICAL FIX: Correct locationLink formatting ---
        // Changed the incorrect backtick string to a valid template literal Google Maps query
const locationLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

        try {
          const res = await fetch("/api/emergency/sos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude, longitude, locationLink }),
          });

          const data = await res.json();
          if (data.success) {
            // Success toast
            toast.success("🚨 SOS Alert Sent Successfully! Help is on the way.", { id: loadingToast, duration: 8000 });
          } else {
            // Failure toast (using server error message if available)
            toast.error(`❌ Failed to send SOS alert: ${data.error || 'Unknown server error.'}`, { id: loadingToast, duration: 8000 });
          }
        } catch (err) {
          console.error("SOS Alert Fetch Error:", err);
          // General error toast
          toast.error("❌ Network Error: Could not reach the emergency server.", { id: loadingToast, duration: 8000 });
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation Error:", error);
        // Geolocation failure toast
        let errorMessage = "❌ Failed to fetch location.";
        if (error.code === error.PERMISSION_DENIED) {
            errorMessage = "❌ Permission Denied: Please allow location access to use SOS.";
        } else if (error.code === error.TIMEOUT) {
            errorMessage = "❌ Location Timeout: Try again, or check your GPS signal.";
        }
        toast.error(errorMessage, { id: loadingToast, duration: 8000 });
        setLoading(false);
      },
      // --- CRITICAL FIX: Add options to prevent blocking and ensure a fresh location ---
      { 
        enableHighAccuracy: true,
        maximumAge: 0, 
        timeout: 15000 
      }
    );
  };

  // --- Navbar/Mobile Styling Logic (as previously recommended) ---
  let buttonClass = "bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300 shadow-lg";
  let buttonText = loading ? "Sending..." : "🚨 Send SOS Alert";

  if (isNavbar) {
    // Compact button for desktop navbar
    buttonClass = `${buttonClass} px-3 py-1.5 rounded-lg text-sm`;
    buttonText = loading ? "Sending..." : "🚨 SOS";
  } else if (isMobileMenu) {
    // Full width for mobile menu
    buttonClass = `${buttonClass} w-full px-6 py-3 rounded-xl text-lg`;
  } else {
    // Original button for main page
    buttonClass = `${buttonClass} px-6 py-3 rounded-full text-lg`;
  }

  return (
    <div className={`flex flex-col items-center ${isNavbar ? 'mt-0' : ''}`}>
      <button
        onClick={triggerSOS}
        disabled={loading}
        className={buttonClass}
      >
        {buttonText}
      </button>
      {/* Remove the status text element */}
      {/* {status && <p className="mt-3 text-sm text-gray-700">{status}</p>} */}
    </div>
  );
}