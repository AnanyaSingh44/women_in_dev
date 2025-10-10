"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, HelpCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const faqData = [
  {
    id: 1,
    que: "What should I do if I experience harassment at work?",
    ans: "You have the right to report harassment to the Internal Complaints Committee (ICC) or appropriate authority. Maintain documentation and evidence, and ensure confidentiality during the process.",
  },
  {
    id: 2,
    que: "Can I file a complaint for public harassment?",
    ans: "Yes. You can file an FIR under relevant IPC sections, seek police protection, and request restraining orders if needed.",
  },
  {
    id: 3,
    que: "What are my rights in domestic abuse situations?",
    ans: "You are entitled to protection from physical, emotional, sexual, and economic abuse. You can request protection orders, residency rights, and compensation.",
  },
  {
    id: 4,
    que: "How can I handle cyber harassment?",
    ans: "You can report online harassment, stalking, or revenge porn. Authorities can remove offensive content and take legal action against offenders.",
  },
];

export default function FaqAccordion() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="w-full   py-20 px-4">
      <div className="max-w-4xl mx-auto">
       
        <p className="text-center text-gray-600 mb-10 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
          Frequently asked questions about women’s safety, harassment, and legal rights.
        </p>

        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isActive = activeIndex === index;

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white border-2 border-pink-200 hover:border-[#EA2264] rounded-xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggle(index)}
                  className={`w-full flex justify-between items-center flex-wrap gap-4 p-4 text-left font-semibold text-sm sm:text-base md:text-lg transition-colors ${isActive
                    ? "bg-[#FECDE1] text-[#EA2264]"
                    : "text-gray-800 hover:bg-[#FFE6F0]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="bg-[#EA2264]/10 text-[#EA2264] rounded-full p-2 shadow shrink-0">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <span className="text-left break-words">{faq.que}</span>
                  </div>

                  <div className="shrink-0">
                    {isActive ? (
                      <ChevronDown className="text-[#EA2264] transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="text-[#EA2264] transition-transform duration-200" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="px-5 overflow-hidden"
                    >
                      <div className="py-4 text-[#EA2264] text-sm sm:text-base leading-relaxed bg-[#FFE6F0]/50 rounded-lg mx-2 mb-2 px-4">
                        {faq.ans}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
