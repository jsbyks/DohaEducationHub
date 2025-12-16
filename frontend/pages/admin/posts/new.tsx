import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { useAuth } from '../../../contexts/AuthContext';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import Toast from '../../../components/Toast';

export default function NewPostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setToast({ message: 'Title and content are required', type: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        setToast({ message: 'You must be logged in', type: 'error' });
        return;
      }

      const base = process.env.NEXT_PUBLIC_BASE_URL || '';
      const response = await fetch(`${base}/api/proxy/api/posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          excerpt: excerpt.trim() || undefined,
          status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create post');
      }

      setToast({ message: 'Post created successfully!', type: 'success' });
      setTimeout(() => router.push('/admin/posts'), 1500);
    } catch (err: any) {
      console.error('Failed to create post:', err);
      setToast({ message: err.message || 'Failed to create post', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const clearToast = () => setToast(null);

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold">Create New Blog Post</h1>
            <p className="text-blue-100 mt-2">Share insights and resources with parents</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href="/admin/posts" className="text-primary-600 hover:text-primary-800">
              ← Back to Posts
            </Link>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter post title..."
                  required
                />
              </div>

              {/* Excerpt */}
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt <span className="text-gray-500 text-sm">(optional)</span>
                </label>
                <textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Brief summary for preview..."
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-1">{excerpt.length}/500 characters</p>
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={15}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                  placeholder="Write your post content in Markdown...&#10;&#10;## Example Heading&#10;&#10;This is a paragraph with **bold** and *italic* text.&#10;&#10;- Bullet point 1&#10;- Bullet point 2"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Supports Markdown formatting</p>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  {status === 'draft'
                    ? 'Save as draft - only visible to admins'
                    : 'Publish - visible to all visitors'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={submitting} size="lg">
                  {submitting ? 'Creating...' : 'Create Post'}
                </Button>
                <Link href="/admin/posts">
                  <Button type="button" variant="outline" size="lg">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
