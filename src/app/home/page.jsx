'use client';
import Link from 'next/link';
import React from 'react';
import AnonymousComplaintForm from '@/components/anonymousForm';

const HomePage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{
  background: 'linear-gradient(to bottom right, #ffe6f0, #ffd9e8, #f7e1ff)'
}}


>
     
       
      {/* Complaint Form */}
      <div className="relative z-10 pt-16 pb-16">
        <AnonymousComplaintForm />
      </div>

     
    </div>
  );
};

export default HomePage