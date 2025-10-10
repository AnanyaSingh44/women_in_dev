'use client';

import  AnonymousComplaintFormToggle  from '@/components/anonymousForm';

export default function AnonymousComplaintPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Anonymous Complaint Form
          </h1>
          <p className="text-gray-600">
            Report incidents safely and anonymously
          </p>
        </div>
        
        <AnonymousComplaintFormToggle />
      </div>
    </div>
  );
}