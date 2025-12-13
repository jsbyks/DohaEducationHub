import Link from 'next/link';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

export default function AdminPostsPage() {
  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-2">Blog Post Management</h1>
            <p className="text-primary-100">Create and manage blog content</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Navigation */}
          <div className="mb-8">
            <Link href="/admin" className="text-primary-600 hover:text-primary-800">
              ← Back to Admin Dashboard
            </Link>
          </div>

          {/* Coming Soon Message */}
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Management Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              The blog post management interface is currently under development.
              <br />
              For now, posts can be created via the API.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                API Endpoint: POST /api/posts/
              </p>
              <p className="text-sm text-gray-500">
                Required fields: title, content
              </p>
              <p className="text-sm text-gray-500">
                Optional: excerpt, status (draft/published)
              </p>
            </div>
          </div>

          {/* Temporary Quick Links */}
          <div className="mt-8 bg-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Alternative Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/blog" className="text-primary-600 hover:text-primary-800">
                View Published Blog Posts →
              </Link>
              <Link href="/admin" className="text-primary-600 hover:text-primary-800">
                Return to Admin Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
