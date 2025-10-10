'use client';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import SOSButton from './SOSButton';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        },
      },
    });
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'shadow-2xl'
          : 'shadow-lg'
      }`}
      style={{
        backgroundColor: '#EA2264'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Brand with animation */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
              ></div>
            
            </div>
         
            <span className="text-4xl font-bold text-white transition-all duration-300">
             StreeSakhi
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* <Link
              href="/"
              className="relative text-white font-semibold transition-colors duration-300 group hover:text-white/90"
            >
              Home
              <span 
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"
              ></span>
            </Link> */}
            <div className="transform transition-transform duration-300 hover:scale-105">
              <SOSButton isNavbar={true} /> 
            </div>
            
            {!mounted || isPending ? (
              <div className="flex items-center space-x-4">
                <div 
                  className="w-24 h-11 rounded-xl animate-pulse"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                ></div>
                <div 
                  className="w-24 h-11 rounded-xl animate-pulse"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                ></div>
              </div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                 <Link href="/dashboard" className="flex items-center space-x-3 px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-white/30" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-sm opacity-40" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}></div>
        <div className="relative w-9 h-9 rounded-full flex items-center justify-center shadow-md ring-2 ring-white/50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
          <span className="text-white text-sm font-bold">
            {session.user?.name?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
      </div>
      <span className="font-semibold text-white">
        {session.user?.name || session.user?.email}
      </span>
    </Link>
                <button
                  onClick={handleLogout}
                  className="relative px-6 py-2.5 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden group border-2 border-white"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <span className="relative z-10">Logout</span>
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  ></div>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signIn"
                  className="relative font-semibold px-6 py-2.5 rounded-xl transition-all duration-300 group overflow-hidden text-white hover:bg-white/10"
                >
                  <span className="relative z-10">Sign In</span>
                </Link>
                <Link
                  href="/auth/signUp"
                  className="relative px-6 py-2.5 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden group border-2 border-white"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <span className="relative z-10">Sign Up</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <div className="transform transition-transform duration-300 hover:scale-105">
              {/* Note: SOSButton will need to be made smaller for the navbar to fit well */}
              <SOSButton isNavbar={true} /> 
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-10 h-10 text-white focus:outline-none rounded-lg transition-all duration-300 flex items-center justify-center hover:bg-white/10"
            >
              <svg
                className="w-6 h-6 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
        isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div 
          className="shadow-xl"
          style={{
            backgroundColor: '#EA2264',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <div className="px-4 py-6 space-y-4">
            {/* <Link
              href="/"
              className="block w-full text-center text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link> */}
            
            {!mounted || isPending ? (
              <div className="space-y-3">
                <div 
                  className="w-full h-12 rounded-xl animate-pulse"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                ></div>
                <div 
                  className="w-full h-12 rounded-xl animate-pulse"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                ></div>
              </div>
            ) : session ? (
              <div className="space-y-4">
                <div 
                  className="flex items-center space-x-4 px-5 py-4 rounded-xl shadow-md border border-white/30"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <div className="relative">
                    <div 
                      className="absolute inset-0 rounded-full blur-md opacity-40"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                    ></div>
                    <div 
                      className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/50"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      <span className="text-white font-bold text-lg">
                        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-white">
                      {session.user?.name}
                    </p>
                    <p className="text-sm text-white/80">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white hover:bg-white/10"
                  style={{ backgroundColor: 'transparent' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/auth/signIn"
                  className="block w-full text-center text-white font-semibold px-6 py-3.5 rounded-xl border-2 border-white transition-all duration-300 transform hover:scale-105 hover:bg-white/10"
                  style={{ backgroundColor: 'transparent' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signUp"
                  className="block w-full text-center text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white hover:bg-white/10"
                  style={{ backgroundColor: 'transparent' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;