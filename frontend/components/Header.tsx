import Link from 'next/link';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">Doha Education Hub</Link>

        <nav className="flex items-center gap-4">
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
      </div>
    </header>
  );
};
