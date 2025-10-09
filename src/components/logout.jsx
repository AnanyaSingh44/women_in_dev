// components/LogoutButton.jsx

'use client'; // This is required for client components in the app router
import React from 'react';
import { redirect, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';


const LogoutButton = () => {
  const handleLogout = async () => {
   await authClient.signOut({
  fetchOptions: {
    onSuccess: () => {
     redirect('/auth/signUp');
    },
  },
});
  };

  return (
    <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
      Logout
    </button>
  );
}

export default LogoutButton;