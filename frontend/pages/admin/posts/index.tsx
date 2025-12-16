import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { useAuth } from '../../../contexts/AuthContext';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import Toast from '../../../components/Toast';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  status: string;
  created_at: string;
  published_at?: string;
}

export default function AdminPostsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (user && !user.is_admin) {
      router.push('/admin');
      return;
    }

    if (user && user.is_admin) {
      loadPosts();
    }
  }, [user]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const base = process.env.NEXT_PUBLIC_BASE_URL || '';
      const response = await fetch(`${base}/api/proxy/api/posts/all?page=1&page_size=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to load posts');
      }

      const data = await response.json();
      setPosts(data.results || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setToast({ message: 'Failed to load posts', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const base = process.env.NEXT_PUBLIC_BASE_URL || '';
      const response = await fetch(`${base}/api/proxy/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setToast({ message: 'Post deleted successfully', type: 'success' });
      loadPosts();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to delete post', type: 'error' });
    }
  };

  const clearToast = () => setToast(null);

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (!user?.is_admin) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card>
            <div className="p-12 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
              <p className="text-gray-600 mb-6">You need administrator privileges to access this page.</p>
              <Link href="/admin">
                <Button>Go to Admin Dashboard</Button>
              </Link>
            </div>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Blog Post Management</h1>
                <p className="text-blue-100">Create and manage blog content</p>
              </div>
              <Link href="/admin/posts/new">
                <Button size="lg">Create New Post</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href="/admin" className="text-primary-600 hover:text-primary-800">
              ← Back to Admin Dashboard
            </Link>
          </div>

          {posts.length === 0 ? (
            <Card>
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No posts yet</h2>
                <p className="text-gray-600 mb-6">Get started by creating your first blog post!</p>
                <Link href="/admin/posts/new">
                  <Button>Create Your First Post</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{post.title}</div>
                            {post.excerpt && (
                              <div className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(post.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex gap-2 justify-end">
                            {post.status === 'published' && (
                              <Link href={`/blog/${post.slug}`} target="_blank">
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                              </Link>
                            )}
                            <Link href={`/admin/posts/${post.id}`}>
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(post.id)}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
