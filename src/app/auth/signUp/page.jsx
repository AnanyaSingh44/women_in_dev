'use client';
import { authClient } from '@/lib/auth-client';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    const { data, error } = await authClient.signUp.email(
      {
        name: name,
        email: email,
        password: password,
        callbackURL: '/dashboard',
      },
      {
        onRequest: () => {
          console.log('Making the request...');
        },
        onSuccess: () => {
          redirect('/dashboard');
        },
        onError: (ctx) => {
          console.log('Error:', ctx);
          setErrorMessage('Signup failed. Please try again.');
        },
      }
    );

    console.log('data', data);
  }

  const handleGoogleSignUp = async () => {
    const data = await authClient.signIn.social({
      provider: 'google',
    });
    console.log('data', data);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 max-h-[100vh] bg-gradient-to-br from-pink-400 via-pink-500 to-purple-500 relative overflow-hidden items-center justify-center">
        {/* Decorative floating shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <img
            src="/Female.svg.png"
            alt="Signup Illustration"
            className="object-contain w-3/4 max-h-[480px] drop-shadow-2xl rounded-3xl"
          />
        </div>
        
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.1); }
          }
          .animate-pulse {
            animation: pulse 4s ease-in-out infinite;
          }
          .delay-1000 {
            animation-delay: 1s;
          }
        `}</style>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 max-h-[100vh] flex items-center justify-center bg-gradient-to-br from-pink-100 via-pink-200 to-purple-200 p-4">
        <form
          className="flex flex-col gap-4 bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md overflow-auto max-h-full"
          onSubmit={handleSubmit}
        >
          <div className="text-center mb-2">
            <div className="w-16 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-sm text-gray-600 mt-1">Join our community today</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">Full Name</label>
            <input
              className="w-full border-2 border-pink-200 p-3 rounded-xl bg-pink-50/30 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition duration-300"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">Email Address</label>
            <input
              className="w-full border-2 border-pink-200 p-3 rounded-xl bg-pink-50/30 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition duration-300"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">Password</label>
            <input
              className="w-full border-2 border-pink-200 p-3 rounded-xl bg-pink-50/30 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition duration-300"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
            <p className="text-xs text-gray-500">Must be at least 8 characters</p>
          </div>

          {errorMessage && (
            <div className="bg-pink-50 border-l-4 border-pink-500 p-3 rounded-lg">
              <p className="text-pink-600 text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          <button
            type="submit"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold p-3 rounded-xl transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Create Account
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="bg-white border-2 border-pink-200 text-gray-700 font-semibold p-3 rounded-xl hover:bg-pink-50 hover:border-purple-300 transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign Up with Google
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <a href="/auth/signIn" className="text-pink-600 font-semibold hover:text-purple-600 transition duration-200">
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;