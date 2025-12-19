import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/60 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                  <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L4.5 7 12 3.5 19.5 7 12 9.5zM2 17l10 5 10-5v-2l-10 5-10-5v2z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-900">Doha Education Hub</span>
            </Link>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const query = searchQuery.trim();
                router.push({ pathname: '/schools', query: query ? { search: query } : {} });
                setIsSearchOpen(false);
              }}
              className="hidden md:flex items-center ml-6 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1"
            >
              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
              <input
                aria-label="Search"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search schools, teachers, topics…"
                className="bg-transparent outline-none text-sm w-64"
              />
            </form>

            {/* Mobile search button */}
            <div className="md:hidden ml-2">
              <button
                type="button"
                aria-label="Open search"
                onClick={() => setIsSearchOpen((s) => !s)}
                className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/schools" className="text-sm text-gray-700 hover:text-blue-600">Schools</Link>
            <Link href="/teachers" className="text-sm text-gray-700 hover:text-blue-600">Teachers</Link>
            <Link href="/government" className="text-sm text-gray-700 hover:text-blue-600">Government</Link>
            <Link href="/blog" className="text-sm text-gray-700 hover:text-blue-600">Blog</Link>

            {user ? (
              <>
                {user.is_admin && (
                  <Link href="/admin" className="text-sm font-medium text-purple-600 hover:text-purple-800">
                    Admin
                  </Link>
                )}
                <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  Dashboard
                </Link>
                <button onClick={() => logout()} className="text-sm text-gray-600 hover:text-red-600">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-700 hover:text-blue-600">Sign in</Link>
                <Link href="/register" className="text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 rounded-lg shadow-sm hover:opacity-95">
                  Sign up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile search input (toggle) */}
        {isSearchOpen && (
          <div className="md:hidden mt-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const query = searchQuery.trim();
                router.push({ pathname: '/schools', query: query ? { search: query } : {} });
                setIsSearchOpen(false);
              }}
              className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
            >
              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
              <input
                autoFocus
                aria-label="Search"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search schools, teachers, topics…"
                className="bg-transparent outline-none text-sm w-full"
              />
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        <div className={`md:hidden mt-3 transition-all ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <nav className="flex flex-col space-y-2 pt-2">
            <Link href="/schools" className="py-2 px-2 rounded-md text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Schools</Link>
            <Link href="/teachers" className="py-2 px-2 rounded-md text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Teachers</Link>
            <Link href="/government" className="py-2 px-2 rounded-md text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Government</Link>
            <Link href="/blog" className="py-2 px-2 rounded-md text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Blog</Link>

            {user ? (
              <>
                {user.is_admin && (
                  <Link href="/admin" className="py-2 px-2 rounded-md text-sm font-medium text-purple-600 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Admin</Link>
                )}
                <Link href="/dashboard" className="py-2 px-2 rounded-md text-sm font-medium text-blue-600 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="py-2 px-2 text-sm text-gray-700 text-left">Sign out</button>
              </>
            ) : (
              <div className="pt-2 border-t border-gray-100">
                <Link href="/login" className="block py-2 px-2 rounded-md text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Sign in</Link>
                <Link href="/register" className="block mt-2 py-2 px-3 rounded-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 text-center" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
