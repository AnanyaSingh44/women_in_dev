import React from 'react';
import { Phone, AlertTriangle, Shield, Heart, Users, MapPin, Briefcase, BookOpen } from 'lucide-react';

// Color map for subtle coloring in HelplineCard
const colorMap = {
    "bg-red-600": { lightBg: "bg-red-50", iconColor: "text-red-600", ringColor: "ring-red-200", hoverColor: "text-red-700" },
    "bg-pink-600": { lightBg: "bg-pink-50", iconColor: "text-pink-600", ringColor: "ring-pink-200", hoverColor: "text-pink-700" },
    "bg-purple-600": { lightBg: "bg-purple-50", iconColor: "text-purple-600", ringColor: "ring-purple-200", hoverColor: "text-purple-700" },
    "bg-orange-600": { lightBg: "bg-orange-50", iconColor: "text-orange-600", ringColor: "ring-orange-200", hoverColor: "text-orange-700" },
    "bg-blue-600": { lightBg: "bg-blue-50", iconColor: "text-blue-600", ringColor: "ring-blue-200", hoverColor: "text-blue-700" },
    "bg-teal-600": { lightBg: "bg-teal-50", iconColor: "text-teal-600", ringColor: "ring-teal-200", hoverColor: "text-teal-700" },
};

// Data structure combining both sections
const HELPLINE_DATA = [
  { 
    title: "National Emergency Response", 
    number: "112", 
    description: "Pan-India single number for Police, Fire & Rescue, and Health services. An initiative of Govt. of India.", 
    icon: AlertTriangle, 
    color: "bg-red-600" 
  },
  { 
    title: "NCW 24×7 Women Helpline", 
    number: "7827170170", 
    description: "National Commission for Women's round-the-clock support.", 
    icon: Phone, 
    color: "bg-pink-600" 
  },
  { 
    title: "National Women Helpline Number", 
    number: "181", 
    description: "General national helpline for women in distress.", 
    icon: Shield, 
    color: "bg-purple-600" 
  },
  { 
    title: "National Child Helpline (CHILDLINE)", 
    number: "1098", 
    description: "Free, 24-hour emergency phone service for children in need of aid and assistance.", 
    icon: Heart, 
    color: "bg-orange-600" 
  },
  { 
    title: "Cyber Crime Helpline", 
    number: "1930", 
    description: "For reporting financial cyber fraud and other cybercrimes.", 
    icon: Briefcase, 
    color: "bg-blue-600" 
  },
  { 
    title: "Women Helpline (General)", 
    number: "1091", 
    description: "Another important helpline number for immediate assistance.", 
    icon: MapPin, 
    color: "bg-teal-600" 
  },
];

const NGO_DATA = [
  { 
    name: "SEWA (Self‑Employed Women’s Association)",
    description: "Empowers nearly two million informal-sector women workers through employment, health care, cooperative services, and social security.",
    focus: "Economic & Livelihood Empowerment",
    icon: Briefcase
  },
  { 
    name: "Breakthrough India",
    description: "Uses mass media and grassroots campaigns (like Bell Bajao) and youth engagement to fight gender-based violence and transform social norms.",
    focus: "Gender Justice & Social Norms",
    icon: BookOpen
  },
  { 
    name: "Raise India Foundation",
    description: "Focuses on underprivileged women and girls, providing skill development, health services, and education programs in Delhi and other urban areas.",
    focus: "Skill Development & Health",
    icon: BookOpen
  },
  { 
    name: "AIDWA (All India Democratic Women’s Association)",
    description: "A nationwide democratic organization advocating for women’s rights, labor justice, education, and gender equality, with over 11 million members.",
    focus: "Rights, Labor Justice & Equality",
    icon: Users
  },
  { 
    name: "WOTR (Watershed Organisation Trust)",
    description: "Operates primarily in rural Maharashtra, advancing gender equity by reducing women’s labor burdens through climate-resilient development.",
    focus: "Rural Equity & Climate Resilience",
    icon: MapPin
  },
];

const HelplineCard = ({ title, number, description, Icon, color }) => {
    // Look up subtle colors based on the main color class
    const { lightBg, iconColor, ringColor, hoverColor } = colorMap[color] || colorMap["bg-red-600"];

    return (
        <div className={`relative p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-white border border-gray-100 transform hover:translate-y-[-1px]`}>
            {/* Subtle color highlight top border */}
            <div className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl ${color}`}></div>
            
            <div className="relative z-10 flex flex-col items-start space-y-4 pt-2">
                {/* Subtle colored icon container */}
                <div className={`p-3 rounded-full ${lightBg} ${iconColor} ring-4 ${ringColor} shadow-inner`}>
                    <Icon className="w-5 h-5" />
                </div>
                
                <div className="w-full">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 leading-snug">{title}</h3>
                    {/* Phone number link with color highlight */}
                    <a 
                        href={`tel:${number}`} 
                        className={`text-3xl font-extrabold ${iconColor} tracking-tight transition-colors duration-200 hover:${hoverColor} block`}
                    >
                        {number}
                    </a>
                    <p className="text-gray-500 mt-2 text-sm">{description}</p>
                </div>
            </div>
        </div>
    );
};

const NGOCard = ({ name, description, focus, Icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 transform hover:translate-y-[-1px]">
    <div className="flex items-start space-x-4">
      {/* Subtle gray icon background */}
      <div className="p-3 bg-gray-100 rounded-lg text-pink-500 shadow-inner">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        {/* Minimalist focus tag */}
        <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-300">
          Focus: {focus}
        </span>
        <p className="text-gray-500 mt-2 text-sm">{description}</p>
      </div>
    </div>
  </div>
);


export default function HelpAndResources() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section (Minimalist Typography) */}
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight mb-3">
            Critical Help & Safety Resources
          </h1>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto font-light">
            Immediate contacts for emergencies and links to trusted organizations committed to women's safety and empowerment.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Last updated: March 20th, 2025
          </p>
        </header>

        {/* --- Helplines Section --- */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-center mb-8 text-gray-700">
            <span className="pb-1 border-b-2 border-pink-300">Emergency Helplines</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {HELPLINE_DATA.map((line, index) => (
              <HelplineCard
                key={index}
                title={line.title}
                number={line.number}
                description={line.description}
                Icon={line.icon}
                color={line.color}
              />
            ))}
          </div>
        </section>

        {/* --- NGOs Section --- */}
        <section>
          <h2 className="text-3xl font-semibold text-center mb-8 text-gray-700">
            <span className="pb-1 border-b-2 border-purple-300">Top 5 NGOs for Women in India</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {NGO_DATA.map((ngo, index) => (
              <NGOCard
                key={index}
                name={ngo.name}
                description={ngo.description}
                focus={ngo.focus}
                Icon={ngo.icon}
              />
            ))}
          </div>
        </section>

        {/* Dual Call to Action Block */}
        <div className="mt-20 p-8 bg-pink-50 rounded-2xl border-2 border-pink-100 shadow-lg">
          <p className="text-xl font-semibold text-gray-700 mb-6 text-center">
            Need more information or legal clarity?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {/* Replaced <Link> with <a> */}
            <a href="/faq">
              <div 
                className="cursor-pointer px-10 py-4 text-white rounded-xl font-bold text-lg sm:text-xl text-center transition-all duration-300 transform hover:scale-[1.03] shadow-md border-2 border-pink-700"
                style={{ backgroundColor: '#EA2264' }}
              >
                Explore FAQ
              </div>
            </a>
            {/* Replaced <Link> with <a> */}
            <a href="/know-your-rights">
              <div 
                className="cursor-pointer px-10 py-4 text-pink-600 rounded-xl font-bold text-lg sm:text-xl text-center transition-all duration-300 transform hover:scale-[1.03] shadow-md border-2 border-pink-300 hover:bg-pink-100"
                style={{ backgroundColor: 'white' }}
              >
                View Detailed Legal Rights
              </div>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
