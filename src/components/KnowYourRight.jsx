"use client";

import { useState } from "react";
import { Briefcase, Gavel, Home, Globe, Eye, HeartHandshake, ChevronDown, ChevronUp } from 'lucide-react';

const rightsData = [
  {
    title: "Workplace Harassment",
    icon: Briefcase,
    law: "The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 (India)",
    rights: [
      "Right to safe working environment free from sexual harassment.",
      "Right to complain to an Internal Complaints Committee (ICC) or appropriate authority.",
      "Right to confidentiality during complaint investigation.",
      "Right to protection from retaliation.",
      "Right to remedial action, including suspension, warning, or termination of harasser.",
    ],
  },
  {
    title: "Public Harassment",
    icon: Gavel,
    law: "Various sections of the Indian Penal Code (IPC), including:\nSection 354: Assault or use of criminal force against women with intent to outrage modesty.\nSection 354A: Sexual harassment and punishment for stalking.\nSection 509: Insulting the modesty of a woman (including verbal harassment).",
    rights: [
      "Right to file FIR against harassment in public spaces.",
      "Right to protection and police action.",
      "Right to seek restraining orders against stalkers or offenders.",
    ],
  },
  {
    title: "Domestic Harassment / Abuse",
    icon: Home,
    law: "Protection of Women from Domestic Violence Act, 2005",
    rights: [
      "Right to protection from physical, sexual, emotional, and economic abuse by family members.",
      "Right to residency in the shared household.",
      "Right to compensation or maintenance.",
      "Right to protection orders (restraining orders, eviction of abuser).",
    ],
  },
  {
    title: "Online / Cyber Harassment",
    icon: Globe,
    law: "Information Technology Act, 2000 (Sections 66E, 67, 67A)",
    rights: [
      "Right to complain about online stalking, harassment, or revenge porn.",
      "Right to removal of offensive content.",
      "Right to police investigation and legal action against cyber offenders.",
    ],
  },
  {
    title: "Stalking and Voyeurism",
    icon: Eye,
    law: "IPC Sections 354C (voyeurism), 354D (stalking)",
    rights: [
      "Right to file complaint and register FIR.",
      "Right to police protection and arrest of offender.",
    ],
  },
  {
    title: "Sexual Assault / Rape",
    icon: HeartHandshake,
    law: "IPC Sections 375, 376, 354, 354B",
    rights: [
      "Right to file FIR and have police investigation.",
      "Right to medical examination and forensic evidence collection.",
      "Right to legal aid and compensation.",
      "Right to fast-track trial under certain schemes.",
    ],
  },
];

export default function KnowYourRights() {
  const [openIndex, setOpenIndex] = useState(null);

  const selectCard = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const selectedItem = openIndex !== null ? rightsData[openIndex] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Heading with decorative border */}
      <div className="text-center mb-12 relative">
        <div className="inline-block relative">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-gray-700 via-gray-600 to-pink-600 bg-clip-text text-transparent">
            Know Your <span className="text-[#EA2264]">Rights</span>
          </h1>
          {/* Decorative underline border */}
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#EA2264] to-transparent rounded-full"></div>
        </div>
      </div>
      
      <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto border-l-4 border-[#EA2264] pl-4 italic">
        Select a category below to understand your legal rights and the laws protecting you against harassment and abuse in India.
      </p>

      {/* Cards Grid with enhanced borders */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 p-6 border-2 border-dashed border-pink-200 rounded-2xl bg-gradient-to-br from-pink-50/30 to-purple-50/30">
        {rightsData.map((item, index) => {
          const IconComponent = item.icon;
          const isSelected = openIndex === index;

          return (
            <button
              key={index}
              onClick={() => selectCard(index)}
              className={`
                aspect-square flex flex-col items-center justify-center p-4 text-center
                rounded-xl shadow-lg border-4 transition-all duration-300 transform hover:scale-[1.03]
                relative overflow-hidden
                ${isSelected
                  ? "bg-gradient-to-br from-[#EA2264] to-[#d4004e] border-[#d4004e] text-white shadow-2xl shadow-pink-500/50"
                  : "bg-white border-pink-200 text-gray-800 hover:shadow-xl hover:border-[#EA2264] hover:bg-pink-50"
                }
              `}
            >
              {/* Corner accent borders for selected card */}
              {isSelected && (
                <>
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/50"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/50"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/50"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/50"></div>
                </>
              )}
              
              <IconComponent className="w-10 h-10 mb-3" />
              <span className="text-sm font-semibold">{item.title}</span>
              <div className="mt-2 text-xs">
                {isSelected ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Details Section with multiple border styles */}
      {selectedItem && (
        <div className="mt-12 relative">
          {/* Outer decorative border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 rounded-2xl blur opacity-25"></div>
          
          {/* Main content box with borders */}
          <div className="relative p-8 bg-white border-4 border-[#EA2264] rounded-2xl shadow-2xl">
            {/* Top accent border */}
            <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent -translate-y-2"></div>
            
            {/* Title section with border */}
            <div className="border-b-4 border-pink-100 pb-4 mb-6">
              <h2 className="text-3xl font-bold text-[#EA2264] flex items-center">
                <span className="w-2 h-8 bg-[#EA2264] rounded-full mr-3"></span>
                {selectedItem.title} - Legal Protection
              </h2>
            </div>
            
            {/* Law section with styled border */}
            <div className="mb-6 border-2 border-pink-200 rounded-xl p-4 bg-pink-50/30">
              <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center border-b-2 border-dashed border-pink-300 pb-2">
                <span className="w-1.5 h-6 bg-gradient-to-b from-[#EA2264] to-pink-400 rounded-full mr-2"></span>
                Applicable Law
              </h3>
              <p className="whitespace-pre-wrap text-gray-600 p-4 rounded-lg text-sm font-mono bg-white border-l-4 border-[#EA2264] shadow-sm">
                {selectedItem.law}
              </p>
            </div>

            {/* Rights section with styled border */}
            <div className="border-2 border-pink-200 rounded-xl p-4 bg-gradient-to-br from-pink-50/50 to-purple-50/50">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center border-b-2 border-dashed border-pink-300 pb-2">
                <span className="w-1.5 h-6 bg-gradient-to-b from-[#EA2264] to-pink-400 rounded-full mr-2"></span>
                Your Rights
              </h3>
              <ul className="space-y-4">
                {selectedItem.rights.map((right, i) => (
                  <li key={i} className="flex items-start bg-white p-3 rounded-lg border-l-4 border-pink-400 shadow-sm hover:shadow-md transition-shadow">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-[#EA2264] text-white font-bold rounded-full text-sm mr-3 mt-0.5">
                      ✓
                    </span>
                    <p className="text-gray-700">{right}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom accent corners */}
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-pink-300 rounded-bl-lg"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-pink-300 rounded-br-lg"></div>
          </div>
        </div>
      )}
    </div>
  );
}