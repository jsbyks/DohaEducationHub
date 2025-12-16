import React from 'react'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen p-4">
          <h2 className="text-lg font-semibold mb-4">Admin</h2>
          <nav className="space-y-2 text-sm">
            <Link href="/admin" className="block p-2 rounded hover:bg-gray-100">Dashboard</Link>
            <Link href="/admin/schools" className="block p-2 rounded hover:bg-gray-100">Schools</Link>
            <Link href="/admin/teachers" className="block p-2 rounded hover:bg-gray-100">Teachers</Link>
            <Link href="/admin/posts" className="block p-2 rounded hover:bg-gray-100">Posts</Link>
            <Link href="/admin/bookings" className="block p-2 rounded hover:bg-gray-100">Bookings</Link>
            <Link href="/admin/settings" className="block p-2 rounded hover:bg-gray-100">Settings</Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
