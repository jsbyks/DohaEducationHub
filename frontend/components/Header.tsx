import Link from 'next/link';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold">Doha Education Hub</Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/schools" className="text-sm text-gray-700 hover:text-primary-600">Schools</Link>
            <Link href="/teachers" className="text-sm text-gray-700 hover:text-primary-600">Teachers</Link>
            <Link href="/government" className="text-sm text-gray-700 hover:text-primary-600">Government</Link>
            <Link href="/blog" className="text-sm text-gray-700 hover:text-primary-600">Blog</Link>
            {user ? (
              <>
                {user.is_admin && (
                  <Link href="/admin" className="text-sm font-medium text-purple-600 hover:text-purple-800">
                    Admin
                  </Link>
                )}
                <Link href="/dashboard" className="text-sm font-medium text-primary-600 hover:text-primary-800">
                  Dashboard
                </Link>
                <button onClick={() => logout()} className="text-sm text-gray-600 hover:text-red-600">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-700 hover:text-primary-600">Sign in</Link>
                <Link href="/register" className="text-sm font-medium text-primary-600 hover:text-primary-800 px-3 py-1 rounded-md border border-primary-600">
                  Sign up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3 pt-4">
              <Link
                href="/schools"
                className="text-sm text-gray-700 hover:text-primary-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Schools
              </Link>
              <Link
                href="/teachers"
                className="text-sm text-gray-700 hover:text-primary-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Teachers
              </Link>
              <Link
                href="/government"
                className="text-sm text-gray-700 hover:text-primary-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Government
              </Link>
              <Link
                href="/blog"
                className="text-sm text-gray-700 hover:text-primary-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              {user ? (
                <>
                  {user.is_admin && (
                    <Link
                      href="/admin"
                      className="text-sm font-medium text-purple-600 hover:text-purple-800 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-primary-600 hover:text-primary-800 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-sm text-gray-600 hover:text-red-600 py-2 text-left"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3 pt-2 border-t border-gray-200">
                  <Link
                    href="/login"
                    className="text-sm text-gray-700 hover:text-primary-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm font-medium text-primary-600 hover:text-primary-800 px-3 py-2 rounded-md border border-primary-600 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
