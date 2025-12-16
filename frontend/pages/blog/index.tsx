import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import SEO from '../../components/SEO';
import { ModernHero } from '../../components/ModernHero';
import { postsAPI, PostListItem } from '../../lib/api';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { imageApi } from '../../lib/imageApi';

interface PostWithImage extends PostListItem {
  featuredImage?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<PostWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 9;

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await postsAPI.list(page, pageSize);

      // Fetch featured images for each post
      const postsWithImages = await Promise.all(
        response.results.map(async (post) => {
          const featuredImage = await imageApi.getBlogCategoryImage(post.title);
          return { ...post, featuredImage };
        })
      );

      setPosts(postsWithImages);
      setTotal(response.total);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const totalPages = Math.ceil(total / pageSize);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <>
      <SEO
        title="Education Insights & Resources - Doha Education Hub Blog"
        description="Expert insights, guides, and resources for parents navigating Doha's education landscape. Tips on choosing schools, understanding curricula, and more."
        path="/blog"
        type="article"
      />

      <div className="min-h-screen">
        {/* Modern Hero Section */}
        <ModernHero
          title="Education Insights & Resources"
          subtitle="Expert guidance on navigating Qatar's education system. From choosing the right school to understanding different curricula - we've got you covered."
          primaryCta={{ text: 'Read Latest Articles', href: '#posts' }}
          secondaryCta={{ text: 'Browse Schools', href: '/schools' }}
          theme="education"
        />

        {/* Main Content */}
        <main className="container-responsive py-16">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card card-gradient p-6 text-center">
              <div className="text-4xl font-bold gradient-text-ocean mb-2">{total}</div>
              <div className="text-gray-600 font-medium">Articles Published</div>
            </div>
            <div className="card card-gradient p-6 text-center">
              <div className="text-4xl font-bold gradient-text-sunset mb-2">10+</div>
              <div className="text-gray-600 font-medium">Topics Covered</div>
            </div>
            <div className="card card-gradient p-6 text-center">
              <div className="text-4xl font-bold gradient-text-ocean mb-2">5,000+</div>
              <div className="text-gray-600 font-medium">Readers Helped</div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div id="posts">
              <div className="section-header mb-8">
                <h2 className="section-title">Latest Articles</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <LoadingSkeleton.BlogCard key={i} />
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="card bg-red-50 border-2 border-red-200 p-8 text-center">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-bold text-red-800 mb-2">Failed to Load Articles</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={fetchPosts}
                className="btn btn-accent"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && posts.length === 0 && (
            <div className="card p-12 text-center">
              <div className="max-w-md mx-auto">
                <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Articles Yet</h3>
                <p className="text-gray-600 mb-6">
                  We're working on creating valuable content for you. Check back soon for expert insights and guides!
                </p>
                <Link href="/schools">
                  <button className="btn btn-primary">
                    Browse Schools Instead
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Posts Grid */}
          {!loading && !error && posts.length > 0 && (
            <>
              <div id="posts" className="section-header mb-8">
                <h2 className="section-title">Latest Articles</h2>
                <p className="section-subtitle">
                  Expert insights and practical advice for educational success in Qatar
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <article className="card card-hover group cursor-pointer overflow-hidden h-full flex flex-col">
                      {/* Featured Image */}
                      <div className="image-card h-56">
                        <img
                          src={post.featuredImage || imageApi.getPlaceholderImage()}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="image-overlay"></div>

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4 z-10">
                          <span className="badge badge-purple">
                            Education
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        {/* Date and Read Time */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(post.published_at || post.created_at)}
                          </div>
                          {post.content && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {getReadTime(post.content)}
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Read More Button */}
                        <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform mt-auto">
                          Read Full Article
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => {
                      setPage(page - 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={page === 1}
                    className="btn btn-secondary disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setPage(pageNum);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                            page === pageNum
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      setPage(page + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={page === totalPages}
                    className="btn btn-secondary disabled:opacity-50"
                  >
                    Next
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}

          {/* Newsletter CTA */}
          {!loading && !error && posts.length > 0 && (
            <div className="hero-gradient rounded-3xl p-12 mt-16 text-center">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Stay Updated with Latest Insights
                </h3>
                <p className="text-xl text-blue-100 mb-8">
                  Get expert education tips, school reviews, and Qatar education news delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="input-field flex-1 max-w-md"
                  />
                  <button className="btn bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 px-8">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
