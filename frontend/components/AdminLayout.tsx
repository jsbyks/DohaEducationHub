import React, { useState } from 'react'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Admin</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden p-1 rounded-md text-gray-500 hover:text-gray-700"
                aria-label="Close sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="space-y-2 text-sm">
              <Link href="/admin" className="block p-2 rounded hover:bg-gray-100" onClick={() => setIsSidebarOpen(false)}>Dashboard</Link>
              <Link href="/admin/schools" className="block p-2 rounded hover:bg-gray-100" onClick={() => setIsSidebarOpen(false)}>Schools</Link>
              <Link href="/admin/teachers" className="block p-2 rounded hover:bg-gray-100" onClick={() => setIsSidebarOpen(false)}>Teachers</Link>
              <Link href="/admin/posts" className="block p-2 rounded hover:bg-gray-100" onClick={() => setIsSidebarOpen(false)}>Posts</Link>
              <Link href="/admin/bookings" className="block p-2 rounded hover:bg-gray-100" onClick={() => setIsSidebarOpen(false)}>Bookings</Link>
              <Link href="/admin/settings" className="block p-2 rounded hover:bg-gray-100" onClick={() => setIsSidebarOpen(false)}>Settings</Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile Header */}
          <div className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
              aria-label="Open sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold">Admin Panel</h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>

          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
