"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DASHBOARD_CARDS = [
  {
    title: "Complaint Management",
    description: "Review and manage harassment complaints, update case status, and communicate with complainants.",
    href: "officer/complaint",
    icon: "📋",
    color: "from-[#EA2264] to-[#c91b56]",
    bgColor: "bg-[#f7e1ff]",
    stats: { label: "Active Cases", key: "activeComplaints" },
    features: ["Case Status Updates", "Communication Thread", "Priority Management", "Document Review"]
  },
  {
    title: "Counsellor and Legal Aid",
    description: "Handle requests for counseling and legal consultation services from users seeking professional help.",
    href: "officer/requests",
    icon: "👥",
    color: "from-[#8B5CF6] to-[#7C3AED]",
    bgColor: "bg-[#ffe6f0]",
    stats: { label: "Pending Requests", key: "pendingRequests" },
    features: ["Request Approval", "Professional Matching", "Contact Facilitation", "Follow-up Tracking"]
  }
];

const QUICK_STATS = [
  { label: "Total Complaints", key: "totalComplaints", icon: "📊", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Resolved Today", key: "resolvedToday", icon: "✅", color: "text-green-600", bg: "bg-green-50" },
  { label: "High Priority", key: "highPriority", icon: "🚨", color: "text-red-600", bg: "bg-red-50" },
  { label: "New Requests", key: "newRequests", icon: "📝", color: "text-purple-600", bg: "bg-purple-50" }
];

function DashboardCard({ card, stats, loading }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(card.href);
  };

  return (
    <div 
      className="bg-white rounded-2xl p-8 shadow-sm border border-[#ffd9e8]/50 hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${card.bgColor}`}>
          <span className="text-2xl">{card.icon}</span>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-600">{card.stats.label}</p>
          {loading ? (
            <div className="w-8 h-6 bg-gray-200 rounded animate-pulse mt-1"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900">{stats[card.stats.key] || 0}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#EA2264] transition-colors">
            {card.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {card.description}
          </p>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Key Features</p>
          <div className="grid grid-cols-2 gap-2">
            {card.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-[#EA2264] rounded-full"></div>
                <span className="text-xs text-gray-600">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <div className="inline-flex items-center text-[#EA2264] font-medium text-sm group-hover:text-[#c91b56] transition-colors">
            Open {card.title}
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStatCard({ stat, value, loading }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ffd9e8]/50">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
          <span className="text-lg">{stat.icon}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
          {loading ? (
            <div className="w-12 h-6 bg-gray-200 rounded animate-pulse mt-1"></div>
          ) : (
            <p className={`text-2xl font-bold ${stat.color}`}>{value || 0}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OfficerDashboard() {
  const { data: session, isPending, error } = authClient.useSession();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!session) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Simulate API call - replace with actual API endpoints
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with actual API response
        setStats({
          activeComplaints: 23,
          pendingRequests: 15,
          totalComplaints: 156,
          resolvedToday: 8,
          highPriority: 5,
          newRequests: 12
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session]);

  const formatDateTime = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#ffe6f0] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-3 border-[#EA2264] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Loading Dashboard</h2>
            <p className="text-gray-800 font-medium">Preparing your workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-[#ffe6f0] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 bg-[#ffd9e8] rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-[#8B0000] font-medium">
              {error?.message || "Please sign in with officer credentials to access this dashboard."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffe6f0] mt-[7vh]">
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-semibold text-gray-900 mb-2">
                  Officer Dashboard
                </h1>
                <p className="text-lg text-gray-700">
Welcome back, <span className="font-semibold">{session?.user?.name}</span>
                </p>
              </div>
            
            </div>
          </div>

        

          {/* Main Dashboard Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {DASHBOARD_CARDS.map((card) => (
              <DashboardCard
                key={card.title}
                card={card}
                stats={stats}
                loading={loading}
              />
            ))}
          </div>
<div>
  <a
  href="https://d3f1dc50678fc91166.gradio.live/"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block px-8 py-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-2xl text-xl shadow transition-colors duration-300"
>
  Try AI Assistant
</a>
</div>
        
        </div>
      </div>

      <style jsx>{`
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
}