import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { postsAPI, Post } from '../../lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SEO from '../../components/SEO';

export default function BlogPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug && typeof slug === 'string') {
      fetchPost(slug);
    }
  }, [slug]);

  const fetchPost = async (postSlug: string) => {
    try {
      setLoading(true);
      const data = await postsAPI.getBySlug(postSlug);
      setPost(data);
    } catch (err: any) {
      console.error('Failed to fetch post:', err);
      if (err.response?.status === 404) {
        setError('Blog post not found');
      } else {
        setError('Failed to load blog post');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Post Not Found'}
          </h1>
          <p className="text-gray-600 mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            legacyBehavior
            href="/blog"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Browse All Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={post.title}
        description={post.excerpt || `Read the latest blog post from Doha Education Hub: ${post.title}`}
        path={`/blog/${post.slug}`}
        image={`/placeholder-blog.jpg`}
        type="article"
        publishedAt={post.published_at || post.created_at}
        modifiedAt={post.updated_at || post.created_at}
      />
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Link legacyBehavior href="/blog" className="text-primary-100 hover:text-white">
              ← Back to Blog
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-primary-100">
            <span>{formatDate(post.published_at || post.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-md p-8 md:p-12">
          {post.excerpt && (
            <div className="text-xl text-gray-600 italic mb-8 pb-8 border-b border-gray-200">
              {post.excerpt}
            </div>
          )}

          <div
            className="prose prose-lg max-w-none"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: ({node, inline, className, children, ...props}: {node: any; inline?: boolean; className?: string; children: React.ReactNode; [key: string]: any}) => (
                  <code className={className} {...props}>
                    {children}
                  </code>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Related Links */}
        <div className="mt-8 text-center">
          <Link
            legacyBehavior
            href="/blog"
            className="inline-block text-primary-600 hover:text-primary-800 font-medium"
          >
            ← Browse More Posts
          </Link>
        </div>
      </div>
    </div>
  );
}
