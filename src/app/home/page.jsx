'use client';
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ImagesSlider } from '@/components/ui/images-slider';
import SOSButton from '@/components/SOSButton';
import VoiceflowChat from '@/components/voiceflowChat';
import KnowYourRights from "@/components/KnowYourRight";
import Link from 'next/link';
import Testimonial from '@/components/Testimonial';

// --- GEOLOCATION UTILITIES ---
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) ** 2 +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const HIGH_RISK_ZONES = [
  { lat: 19.0760, lon: 72.8777, name: "Mumbai Central Area" }, 
  { lat: 12.9716, lon: 77.5946, name: "Bangalore City Center" },
  { lat: 20.949694, lon: 79.026389, name: "Current Test Zone (Borkhedi, MH)" } 
];

const DETECTION_RADIUS_METERS = 50;

// --- HOME PAGE COMPONENT ---
const HomePage = () => {
  const images = ["head2.jpeg", "head3.jpg", "head4.webp","logo.svg"];
  const [isNearRiskZone, setIsNearRiskZone] = useState(false);
  const [zoneName, setZoneName] = useState("");
  const [alertClosed, setAlertClosed] = useState(false);

  // Geolocation monitoring
  useEffect(() => {
    if (!navigator.geolocation) return console.warn('Geolocation not supported.');

    const checkRiskZone = ({ coords }) => {
      const { latitude, longitude } = coords;
      let nearZone = false;
      let zoneLabel = "";

      for (const zone of HIGH_RISK_ZONES) {
        if (getDistance(latitude, longitude, zone.lat, zone.lon) < DETECTION_RADIUS_METERS) {
          nearZone = true;
          zoneLabel = zone.name;
          break;
        }
      }

      if (isNearRiskZone !== nearZone) {
        setIsNearRiskZone(nearZone);
        setZoneName(zoneLabel);
        if (nearZone) setAlertClosed(false);
      }
    };

    const watcher = navigator.geolocation.watchPosition(
      checkRiskZone,
      (err) => console.error('Geolocation error:', err.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [isNearRiskZone]);

  const navigationItems = [
    { title: "Report", icon: "M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z", href: "/anonymousForm", gradient: "from-purple-500 to-pink-500" },
    { title: "Track", icon: "M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M6,7H18V9H6V7M6,11H15V13H6V11Z", href: "/complaints", gradient: "from-blue-500 to-cyan-500" },
    { title: "Community", icon: "M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-1.1-.9-2-2-2s-2 .9-2 2V18H4zm9.5-13c-.83 0-1.5.67-1.5 1.5S12.67 7 13.5 7 15 6.33 15 5.5 14.33 5 13.5 5zm1.5 2.5h2L16 13h-2L13 7.5z", href: "/community", gradient: "from-emerald-500 to-teal-500" },
    { title: "Legal Aid", icon: "M16.84,2.73C16.45,2.73 16.07,2.88 15.77,3.17L13.65,5.29L18.95,10.6L21.07,8.5C21.67,7.89 21.67,6.94 21.07,6.33L17.9,3.17C17.6,2.88 17.22,2.73 16.84,2.73M12.94,6L4.84,14.11L7.4,14.39L16.11,5.68M4.25,15.04L2.5,21.73L9.2,19.94L8.96,17.38", href: "/aid", gradient: "from-amber-500 to-orange-500" }
  ];

  return (
    <div className="min-h-screen mt-[8vh] relative flex flex-col items-center justify-start bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">

      {/* Risk Zone Alert */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: isNearRiskZone && !alertClosed ? 0 : -100 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 left-0 right-0 z-60 p-3 bg-red-600 shadow-lg text-white font-bold flex justify-between items-center"
      >
        <p className="flex items-center space-x-3">
          <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <span>ALERT! You are entering a high-risk zone: {zoneName}.</span>
          <span className="text-yellow-300 ml-2">Be ready to use SOS.</span>
        </p>
        <button onClick={() => setAlertClosed(true)} className="ml-4 bg-red-700 hover:bg-red-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">×</button>
      </motion.div>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-pink-100/10 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="relative flex w-full max-w-[170vh] mt-[8vh] h-[80vh] overflow-hidden">

        {/* Left: Image Slider */}
        <div className="w-1/2 h-full relative">
          <ImagesSlider className="h-full rounded-l-3xl shadow-xl" images={images} />
        </div>

  {/* Right: Content */}
<div className="w-1/2 h-full relative flex flex-col justify-center items-center p-12 space-y-10 rounded-r-3xl shadow-2xl
                border-10 border-gradient-to-br border-pink-400 border-opacity-40
                before:absolute before:inset-0 before:rounded-r-3xl before:border-2 before:border-dashed before:border-pink-200/30
                bg-white/50 backdrop-blur-sm">
  
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
    <h1 className="text-9xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent mb-2 tracking-tight">
      StreeSakhi
    </h1>
    <div className="h-0.5 w-20 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 mx-auto mt-3 rounded-full"></div>
    <p className="text-gray-600 text-sm mt-3 font-light tracking-wide">Your Safe Space</p>
  </motion.div>

 

  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="grid grid-cols-2 gap-4 w-full max-w-md">
    {navigationItems.map((item, index) => (
      <motion.button key={item.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => (window.location.href = item.href)}
        className="group relative rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-pink-200/40">
        
        <div className="flex flex-col items-center space-y-3">
          <div className={`bg-gradient-to-br ${item.gradient} rounded-xl p-3 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d={item.icon} /></svg>
          </div>
          <span className="text-gray-700 font-medium text-sm tracking-wide">{item.title}</span>
        </div>
      </motion.button>
    ))}
  </motion.div>
 
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }} className="flex items-center space-x-2 text-gray-500 text-xs">
    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
    <span className="font-light tracking-wide">Available 24/7</span>
  </motion.div>
</div>

      </div>

      <KnowYourRights />

      {/* Voiceflow Chat */}
      <div className="fixed bottom-5 right-5 z-10">
        <VoiceflowChat />
      </div>
   
   <Testimonial/> 
<div className="flex flex-wrap justify-center items-center gap-8 mt-12 mb-16 border-4 border-pink-500 rounded-3xl bg-white/70 shadow-lg px-[42vh] py-5">
  <Link href="/faq" className="cursor-pointer px-12 py-6 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl font-bold text-2xl sm:text-3xl text-center transition-colors duration-300">
    FAQ
  </Link>
  <Link href="/help" className="cursor-pointer px-12 py-6 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl font-bold text-2xl sm:text-3xl text-center transition-colors duration-300">
    Help Contacts
  </Link>
</div>




    </div>

    
  );
};

export default HomePage;
