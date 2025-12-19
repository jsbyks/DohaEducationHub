import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { postsAPI, Post } from '../../lib/api';
import { imageApi } from '../../lib/imageApi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SEO from '../../components/SEO';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export default function BlogPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [related, setRelated] = useState<Array<any & { featuredImage?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(progress, 100));
      setShowBackToTop(scrollTop > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      // Fetch a relevant featured image for the post (cached in imageApi)
      imageApi.getBlogCategoryImage(data.title).then((img) => setFeaturedImage(img)).catch(() => {});
      // fetch related posts (simple recent list) with images
      postsAPI.list(1, 3).then(async (res) => {
        const postsWithImages = await Promise.all(
          (res.results || []).map(async (p) => ({
            ...p,
            featuredImage: await imageApi.getBlogCategoryImage(p.title).catch(() => '')
          }))
        );
        setRelated(postsWithImages);
      }).catch(() => {});
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
        {/* Hero Skeleton */}
        <div className="relative h-64 md:h-96 bg-gradient-to-r from-blue-100 to-cyan-100 animate-pulse">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2">
            <div className="card p-6 md:p-12 space-y-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
              </div>
            </div>
          </main>
          <aside className="lg:col-span-1">
            <div className="card p-4 space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-gray-50">
        <div className="max-w-md w-full card card-gradient p-12 text-center">
          <svg className="w-20 h-20 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-3xl font-bold gradient-text-ocean mb-4">
            {error || 'Post Not Found'}
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/blog">
            <button className="btn btn-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Browse All Posts
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          aria-label="Back to top"
        >
          <svg className="w-6 h-6 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      <SEO
        title={post.title}
        description={post.excerpt || `Read the latest blog post from Doha Education Hub: ${post.title}`}
        path={`/blog/${post.slug}`}
        image={featuredImage || `/placeholder-blog.jpg`}
        type="article"
        publishedAt={post.published_at || post.created_at}
        modifiedAt={post.updated_at || post.created_at}
      />
      {/* Modern Hero Section */}
      <div className="relative h-72 md:h-[500px] overflow-hidden">
        {/* Featured Image */}
        <div className="absolute inset-0">
          <img
            src={featuredImage || imageApi.getPlaceholderImage(1600, 900)}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>

        {/* Animated Accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20"></div>

        {/* Content */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between py-8">
          {/* Back Button */}
          <div>
            <Link href="/blog">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white font-semibold transition-all hover:scale-105">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Blog
              </button>
            </Link>
          </div>

          {/* Title and Meta */}
          <div className="space-y-6 pb-8">
            {/* Category Badge */}
            <div>
              <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-bold rounded-full shadow-lg">
                Education Insights
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl animate-fade-in-up">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{formatDate(post.published_at || post.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{Math.max(1, Math.ceil((post.content || '').split(/\s+/).length / 200))} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold shadow-lg">
                  D
                </div>
                <span className="font-medium">Doha Education Hub</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <main className="lg:col-span-2">
          <article className="card card-gradient p-8 md:p-12 space-y-8">
            {/* Excerpt Lead */}
            {post.excerpt && (
              <div className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium italic pl-6 border-l-4 border-gradient-ocean rounded">
                {post.excerpt}
              </div>
            )}

            {/* Social Share Bar */}
            <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-gray-200">
              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  D
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Doha Education Hub</div>
                  <div className="text-sm text-gray-500">Education Experts</div>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-600 hidden sm:block">Share:</span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all hover:scale-110 shadow-sm"
                  title="Share on Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white transition-all hover:scale-110 shadow-sm"
                  title="Share on Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-800 hover:text-white transition-all hover:scale-110 shadow-sm"
                  title="Share on LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-600 hover:text-white transition-all hover:scale-110 shadow-sm"
                  title="Copy link"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg prose-blue max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => (
                    <div className="my-12">
                      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight" {...props} />
                      <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"></div>
                    </div>
                  ),
                  h2: ({node, ...props}) => (
                    <div className="mt-12 mb-6">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight inline-flex items-center gap-3" {...props} />
                      <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-2"></div>
                    </div>
                  ),
                  h3: ({node, ...props}) => (
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-4 flex items-center gap-3" {...props} />
                  ),
                  h4: ({node, ...props}) => (
                    <h4 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3" {...props} />
                  ),
                  p: ({node, ...props}) => (
                    <p className="text-lg leading-[1.8] text-gray-700 mb-6" {...props} />
                  ),
                  a: ({node, ...props}) => (
                    <a className="text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-2 font-medium transition-colors hover:decoration-blue-400" {...props} />
                  ),
                  img: ({node, ...props}) => (
                    <figure className="my-12 -mx-4 md:-mx-8">
                      <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                        <img {...props} className="w-full transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      {props.alt && (
                        <figcaption className="text-center text-sm text-gray-500 mt-4 px-4 italic">
                          {props.alt}
                        </figcaption>
                      )}
                    </figure>
                  ),
                  blockquote: ({node, ...props}) => (
                    <div className="my-10">
                      <blockquote className="relative border-l-4 border-blue-600 pl-8 pr-6 py-6 bg-gradient-to-r from-blue-50 via-blue-25 to-transparent rounded-r-2xl shadow-sm" {...props}>
                        <div className="absolute top-4 left-3 text-blue-200 text-6xl leading-none font-serif">"</div>
                        <div className="relative italic text-gray-800 text-xl font-medium leading-relaxed">{props.children}</div>
                      </blockquote>
                    </div>
                  ),
                  code: ({node, inline, className, children, ...props}: {node: any; inline?: boolean; className?: string; children: React.ReactNode; [key: string]: any}) => (
                    inline ? (
                      <code className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-900 px-2.5 py-1 rounded-lg text-base font-mono font-semibold border border-blue-200" {...props}>{children}</code>
                    ) : (
                      <div className="my-10 rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-800">
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-3 flex items-center justify-between border-b border-gray-700">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                          <span className="text-gray-400 text-xs font-mono">code</span>
                        </div>
                        <pre className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-100 p-6 overflow-auto">
                          <code className="font-mono text-sm leading-relaxed" {...props}>{children}</code>
                        </pre>
                      </div>
                    )
                  ),
                  ul: ({node, ...props}) => (
                    <ul className="list-none ml-0 space-y-4 my-8" {...props} />
                  ),
                  li: ({node, children, ...props}) => (
                    <li className="flex items-start gap-4 text-lg text-gray-700 bg-gray-50 rounded-xl p-4 hover:bg-blue-50 transition-colors" {...props}>
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center mt-0.5">
                        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="flex-1">{children}</span>
                    </li>
                  ),
                  ol: ({node, ...props}) => (
                    <ol className="list-none ml-0 space-y-4 my-8 counter-reset-list" {...props} />
                  ),
                  table: ({node, ...props}) => (
                    <div className="my-12 overflow-hidden rounded-2xl shadow-2xl border-2 border-gray-200">
                      <div className="overflow-auto">
                        <table className="min-w-full divide-y divide-gray-300" {...props} />
                      </div>
                    </div>
                  ),
                  thead: ({node, ...props}) => (
                    <thead className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white" {...props} />
                  ),
                  th: ({node, ...props}) => (
                    <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wider border-r border-blue-500 last:border-r-0" {...props} />
                  ),
                  tbody: ({node, ...props}) => (
                    <tbody className="bg-white divide-y divide-gray-200" {...props} />
                  ),
                  td: ({node, ...props}) => (
                    <td className="px-8 py-5 text-gray-700 border-r border-gray-200 last:border-r-0" {...props} />
                  ),
                  tr: ({node, ...props}) => (
                    <tr className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200" {...props} />
                  ),
                  strong: ({node, ...props}) => (
                    <strong className="font-bold text-gray-900 bg-yellow-100 px-1 rounded" {...props} />
                  ),
                  em: ({node, ...props}) => (
                    <em className="italic text-blue-800 font-medium" {...props} />
                  ),
                  hr: ({node, ...props}) => (
                    <div className="my-12 flex items-center gap-4" {...props}>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    </div>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Key Takeaways Box */}
            <div className="my-12 overflow-hidden rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-xl font-bold text-white">Key Takeaways</h4>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                  <p className="text-gray-700 leading-relaxed">This article provides comprehensive insights into Qatar's education system</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                  <p className="text-gray-700 leading-relaxed">Expert guidance to help families make informed decisions</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                  <p className="text-gray-700 leading-relaxed">Practical tips and actionable recommendations</p>
                </div>
              </div>
            </div>

            {/* Quick Facts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition-transform">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">300+</div>
                    <div className="text-blue-100 text-sm">Schools in Qatar</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition-transform">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">200K+</div>
                    <div className="text-cyan-100 text-sm">Students Enrolled</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Tip Box */}
            <div className="my-10 overflow-hidden rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
              <div className="flex items-start gap-4 p-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-green-900 mb-2">Pro Tip</h4>
                  <p className="text-green-800 leading-relaxed">Visit schools during their open house events to get a real feel for the environment and talk directly with teachers and administrators.</p>
                </div>
              </div>
            </div>

            {/* Warning Box */}
            <div className="my-10 overflow-hidden rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg">
              <div className="flex items-start gap-4 p-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-amber-900 mb-2">Important Note</h4>
                  <p className="text-amber-800 leading-relaxed">Application deadlines vary by school. Start your research and applications early to secure your preferred choice.</p>
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div className="pt-8 border-t-2 border-gray-200 mt-12">
              <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Topics
              </h4>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-sm font-bold rounded-full hover:scale-105 transition-transform shadow-sm">
                  <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  Education
                </span>
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 text-sm font-bold rounded-full hover:scale-105 transition-transform shadow-sm">
                  <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  Schools
                </span>
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-sm font-bold rounded-full hover:scale-105 transition-transform shadow-sm">
                  <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Qatar
                </span>
              </div>
            </div>
          </article>

        </main>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* About Section */}
            <div className="card card-gradient">
              <div className="p-6 space-y-6">
                {/* Author Profile */}
                <div className="text-center pb-6 border-b border-gray-200">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-3xl shadow-xl">
                    D
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Doha Education Hub</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Your trusted source for education guidance in Qatar
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 py-4 border-b border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text-ocean">50+</div>
                    <div className="text-xs text-gray-600 mt-1">Articles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text-sunset">5K+</div>
                    <div className="text-xs text-gray-600 mt-1">Readers</div>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-2">
                  <Link href="/schools">
                    <button className="btn btn-primary w-full justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Browse Schools
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Related Posts */}
            {related.length > 0 && (
              <div className="card card-gradient p-6">
                <div className="flex items-center gap-2 mb-6">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <h4 className="text-lg font-bold text-gray-900">Related Articles</h4>
                </div>
                <div className="space-y-4">
                  {related.map((r) => (
                    <Link key={r.id} href={`/blog/${r.slug}`}>
                      <div className="group cursor-pointer">
                        <div className="flex gap-4 p-3 rounded-xl hover:bg-blue-50 transition-all hover:scale-[1.02]">
                          {/* Thumbnail */}
                          <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={r.featuredImage || imageApi.getPlaceholderImage(200, 200)}
                              alt={r.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                              {r.title}
                            </h5>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{Math.max(1, Math.ceil((r.content || r.excerpt || '').split(/\s+/).length / 200))} min</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter CTA */}
            <div className="card hero-gradient p-8 text-center">
              <svg className="w-12 h-12 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h4 className="text-xl font-bold text-white mb-3">Stay Updated</h4>
              <p className="text-blue-100 text-sm mb-4">
                Get the latest education insights delivered to your inbox
              </p>
              <input
                type="email"
                placeholder="Your email"
                className="input-field w-full mb-3 text-center"
              />
              <button className="btn bg-white text-blue-600 hover:bg-gray-100 w-full justify-center">
                Subscribe
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
