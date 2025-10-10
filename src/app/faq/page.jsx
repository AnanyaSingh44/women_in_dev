// app/faq/page.jsx (or pages/faq.jsx)
"use client";

import FaqAccordion from "@/components/faq";
import SOSButton from "@/components/SOSButton";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#EA2264] text-center mt-[15vh]">
          FAQ&apos;S
        </h1>
        <FaqAccordion themeColor="#EA2264" />
        <SOSButton/>
      </div>
    </div>
  );
}
