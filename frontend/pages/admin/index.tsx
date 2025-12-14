import Link from 'next/link';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();

  const adminCards = [
    {
      title: 'Review Moderation',
      description: 'Approve or reject pending school reviews',
      href: '/admin/reviews',
      icon: '📝',
      color: 'bg-blue-500',
    },
    {
      title: 'Blog Posts',
      description: 'Create, edit, and publish blog content',
      href: '/admin/posts',
      icon: '📰',
      color: 'bg-green-500',
    },
    {
      title: 'School Management',
      description: 'Manage school listings and details',
      href: '/schools',
      icon: '🏫',
      color: 'bg-purple-500',
    },
    {
      title: 'Teacher Management',
      description: 'Verify and manage teacher profiles',
      href: '/admin/teachers',
      icon: '👨‍🏫',
      color: 'bg-orange-500',
    },
    {
      title: 'Staging Schools',
      description: 'Review and approve imported schools',
      href: '/admin/staging',
      icon: '⏳',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-primary-100">Welcome, {user?.full_name || user?.email}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Navigation */}
          <div className="mb-8">
            <Link href="/" className="text-primary-600 hover:text-primary-800">
              ← Back to Site
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">Admin</div>
                <div className="text-sm text-gray-600">Account Type</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">Active</div>
                <div className="text-sm text-gray-600">Status</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">Full Access</div>
                <div className="text-sm text-gray-600">Permissions</div>
              </div>
            </div>
          </div>

          {/* Admin Tools */}
          <h2 className="text-2xl font-bold mb-6">Admin Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group"
              >
                <div className={`${card.color} p-4 text-center`}>
                  <div className="text-5xl">{card.icon}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600">{card.description}</p>
                  <div className="mt-4 text-primary-600 font-medium">
                    Manage →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Links */}
          <div className="mt-12 bg-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/dashboard" className="text-primary-600 hover:text-primary-800">
                My Dashboard
              </Link>
              <Link href="/schools" className="text-primary-600 hover:text-primary-800">
                Browse Schools
              </Link>
              <Link href="/blog" className="text-primary-600 hover:text-primary-800">
                View Blog
              </Link>
              <Link href="/" className="text-primary-600 hover:text-primary-800">
                Home Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
