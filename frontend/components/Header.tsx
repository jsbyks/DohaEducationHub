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
          <Link href="/schools" className="text-sm text-gray-700">Schools</Link>
          {user ? (
            <>
              <Link href="/profile" className="text-sm text-gray-700">Profile</Link>
              <button onClick={() => logout()} className="text-sm text-red-600">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-700">Sign in</Link>
              <Link href="/register" className="text-sm text-primary-600">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
