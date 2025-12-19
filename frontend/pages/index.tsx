import SEO from '../components/SEO';
import Link from 'next/link';
import { ModernHero } from '../components/ModernHero';
import { FeatureCard } from '../components/FeatureCard';
import { useState, useEffect } from 'react';
import { imageApi } from '../lib/imageApi';

export default function Home() {
  const [schoolImages, setSchoolImages] = useState<string[]>([]);
  const [teacherImage, setTeacherImage] = useState<string>('');

  useEffect(() => {
    // Fetch featured images for school cards
    Promise.all([
      imageApi.getFeaturedImage('school'),
      imageApi.getFeaturedImage('classroom'),
      imageApi.getFeaturedImage('students'),
    ]).then(setSchoolImages);

    // Fetch teacher section image
    imageApi.getFeaturedImage('teacher').then(setTeacherImage);
  }, []);

  return (
    <>
      <SEO
        title="433 Verified Schools in Doha | Find Your Perfect School"
        description="Search 433 schools in Doha with 367 verified phone numbers. Compare curricula, fees, and locations in 60 seconds. Real data, trusted by 8,500+ families."
        path="/"
      />

      <div className="min-h-screen">
        {/* Trust Bar - Above Hero */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3">
          <div className="container-responsive">
            <div className="flex items-center justify-center gap-6 text-sm font-medium flex-wrap">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                433 Schools Listed
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                367 Verified Phone Numbers
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Updated Dec 18, 2025
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-100/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-purple-100/20 to-transparent"></div>

          <div className="container-responsive relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-6">
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                  <span className="text-blue-800 text-sm font-semibold">Qatar's Most Comprehensive School Directory</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  Find Your Child's Perfect School from{' '}
                  <span className="gradient-text-ocean">433 Verified Schools</span>{' '}
                  in Doha
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Stop the endless research. Compare curricula, fees, and locations in 60 seconds.
                  Real data from <strong>367 schools with verified contact information</strong>.
                </p>

                {/* Parent Testimonial */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-100 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                        SM
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 italic mb-3 leading-relaxed">
                        "After visiting 12 schools, I wish I'd found this first. It saved us
                        <strong> weeks of research</strong> and gave us confidence in our choice."
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">Sarah M.</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600 text-sm">British expat, Mother of 2</span>
                        <div className="ml-auto flex gap-1">
                          {[1,2,3,4,5].map(i => (
                            <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary CTA - Unmissable */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link href="/schools">
                    <button className="btn btn-primary text-xl px-10 py-5 shadow-2xl hover:scale-105 transition-transform group">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Search 433 Schools Now
                      <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </Link>
                  <Link href="/fees">
                    <button className="btn btn-secondary text-lg px-8 py-5">
                      Compare All Fees
                    </button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-md border border-gray-200">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-gray-700">8,500+ Families Helped</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-md border border-gray-200">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="font-semibold text-gray-700">100% Free to Use</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-md border border-gray-200">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="font-semibold text-gray-700">Verified Data</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Stats Card */}
              <div className="relative">
                <div className="card card-glass p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Real-Time Database</h3>
                    <p className="text-gray-600">Verified & Updated Daily</p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                      <div>
                        <div className="text-sm text-gray-600 font-medium mb-1">Total Schools</div>
                        <div className="text-4xl font-bold gradient-text-ocean">433</div>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <div>
                        <div className="text-sm text-gray-600 font-medium mb-1">Verified Phones</div>
                        <div className="text-4xl font-bold gradient-text-forest">367</div>
                        <div className="text-xs text-green-600 font-semibold mt-1">84.8% Coverage</div>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <div>
                        <div className="text-sm text-gray-600 font-medium mb-1">GPS Locations</div>
                        <div className="text-4xl font-bold gradient-text-sunset">383</div>
                        <div className="text-xs text-purple-600 font-semibold mt-1">88.5% Mapped</div>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                      <div>
                        <div className="text-sm text-gray-600 font-medium mb-1">Fee Range</div>
                        <div className="text-2xl font-bold gradient-text-sunset">QR 15K - 80K</div>
                        <div className="text-xs text-orange-600 font-semibold mt-1">Per Year</div>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container-responsive">
            <div className="section-header">
              <h2 className="section-title">Why Choose Doha Education Hub?</h2>
              <p className="section-subtitle">
                The complete platform for discovering schools and finding expert teachers in Qatar
              </p>
            </div>

            <div className="grid-auto-fit">
              <FeatureCard
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
                title="Smart Search"
                description="Advanced filters for curriculum, location, fees, and facilities. Find exactly what you're looking for in seconds."
                link="/schools"
                gradient="from-blue-500 to-cyan-500"
              />

              <FeatureCard
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                }
                title="Verified Information"
                description="Accurate, up-to-date school profiles with verified contact details, fees, and facility information you can trust."
                gradient="from-green-500 to-emerald-500"
              />

              <FeatureCard
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
                title="Compare Schools"
                description="Side-by-side comparison tool to evaluate curricula, fees, facilities, and make informed decisions."
                link="/schools"
                gradient="from-purple-500 to-pink-500"
              />

              <FeatureCard
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
                title="Expert Teachers"
                description="Connect with qualified tutors across all subjects. Browse profiles, ratings, and book sessions instantly."
                link="/teachers"
                gradient="from-orange-500 to-red-500"
              />

              <FeatureCard
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                }
                title="Educational Blog"
                description="Expert insights on choosing schools, understanding curricula, and navigating Qatar's education system."
                link="/blog"
                gradient="from-indigo-500 to-purple-500"
              />

              <FeatureCard
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="Fees Comparison"
                description="Compare tuition costs across all schools. View detailed fee structures by grade level in one comprehensive table."
                link="/fees"
                gradient="from-teal-500 to-cyan-500"
              />
            </div>
          </div>
        </section>

        {/* Featured Schools Preview */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="container-responsive">
            <div className="section-header">
              <h2 className="section-title">Discover Top Schools</h2>
              <p className="section-subtitle">
                Browse our comprehensive database of 433 international schools in Doha
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {schoolImages.map((image, index) => {
                const schools = [
                  { name: 'British Curriculum', count: '35+ Schools', curriculum: 'British' },
                  { name: 'American Curriculum', count: '28+ Schools', curriculum: 'American' },
                  { name: 'IB Programs', count: '15+ Schools', curriculum: 'IB' },
                ];
                const school = schools[index];

                return (
                  <Link key={index} href="/schools">
                    <div className="card card-hover group cursor-pointer overflow-hidden">
                      <div className="image-card group h-56">
                        <img
                          src={image || imageApi.getPlaceholderImage()}
                          alt={school.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="image-overlay"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                          <h3 className="text-2xl font-bold text-white mb-1">{school.name}</h3>
                          <p className="text-blue-100">{school.count}</p>
                        </div>
                      </div>
                      <div className="p-6">
                        <span className="badge badge-primary">{school.curriculum}</span>
                        <button className="btn btn-secondary w-full mt-4 group">
                          Explore Schools
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center">
              <Link href="/schools">
                <button className="btn btn-primary text-lg px-8 py-4 group">
                  View All Schools
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Fees Comparison Featured Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
          <div className="container-responsive">
            <div className="card hero-gradient overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Left Column - Content */}
                <div className="p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 w-fit">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    <span className="text-white text-sm font-semibold">New Feature</span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    Compare School Fees Side-by-Side
                  </h2>

                  <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                    View comprehensive tuition costs for all 433 schools in Doha. Filter by curriculum, sort by price, and find the best value for your child's education.
                  </p>

                  <div className="space-y-4 mb-10">
                    {[
                      'Compare fees across 433 schools instantly',
                      'Grade-by-grade fee breakdown',
                      'Filter by curriculum and school type',
                      'Sort by average fees or school name',
                      'Updated daily with verified pricing',
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mt-0.5">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-white text-lg">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/fees">
                      <button className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 group">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        View Fees Table
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </Link>
                    <Link href="/schools">
                      <button className="btn btn-secondary text-lg px-8 py-4">
                        Browse Schools
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Right Column - Visual */}
                <div className="hidden lg:flex items-center justify-center p-12 bg-gradient-to-br from-white/10 to-transparent">
                  <div className="relative">
                    {/* Decorative elements */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-300/20 rounded-full blur-3xl"></div>

                    {/* Icon Stack */}
                    <div className="relative space-y-6">
                      <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-transform">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 font-medium">Average Fee Range</div>
                          <div className="text-2xl font-bold gradient-text-ocean">QR 20K - 52K</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-transform ml-8">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 font-medium">Schools Listed</div>
                          <div className="text-2xl font-bold gradient-text-sunset">433 Schools</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-transform">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 font-medium">Filter Options</div>
                          <div className="text-2xl font-bold gradient-text-forest">10+ Filters</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Teachers Section */}
        <section className="py-20 bg-white">
          <div className="container-responsive">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="gradient-text-ocean">Are You a Teacher?</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Join our platform and connect with students across Doha. Share your expertise, set your own schedule, and build a thriving tutoring practice.
                </p>

                <div className="space-y-4 mb-10">
                  {[
                    'Set your own schedule and hourly rates',
                    'Teach online or meet students in person',
                    'Build your reputation with student reviews',
                    'Secure payment processing through the platform',
                    'Access to a growing community of learners',
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 group">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-lg">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/teacher/create-profile">
                    <button className="btn btn-accent text-lg px-8 py-4 group">
                      Become a Teacher
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </Link>
                  <Link href="/teachers">
                    <button className="btn btn-secondary text-lg px-8 py-4">
                      Browse Teachers
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right Column - Stats Card with Image */}
              <div className="relative">
                {teacherImage && (
                  <div className="image-card group h-96 mb-6 rounded-3xl">
                    <img
                      src={teacherImage}
                      alt="Teacher teaching students"
                      className="w-full h-full object-cover"
                    />
                    <div className="image-overlay"></div>
                  </div>
                )}

                <div className="card-glass p-8 -mt-32 relative z-10 mx-4">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4 float-animation">🎓</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Teacher Platform Stats</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-200/50 pb-4">
                      <span className="text-gray-600 font-medium">Active Teachers</span>
                      <span className="text-3xl font-bold gradient-text-ocean">200+</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200/50 pb-4">
                      <span className="text-gray-600 font-medium">Subjects Offered</span>
                      <span className="text-3xl font-bold gradient-text-ocean">50+</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200/50 pb-4">
                      <span className="text-gray-600 font-medium">Average Rating</span>
                      <span className="text-3xl font-bold gradient-text-sunset">⭐ 4.8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Sessions Booked</span>
                      <span className="text-3xl font-bold gradient-text-ocean">5,000+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Curricula Overview */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container-responsive">
            <div className="section-header">
              <h2 className="section-title">Explore by Curriculum</h2>
              <p className="section-subtitle">
                Find schools offering your preferred educational system
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'British', icon: '🇬🇧', color: 'from-blue-500 to-blue-600' },
                { name: 'American', icon: '🇺🇸', color: 'from-red-500 to-red-600' },
                { name: 'IB', icon: '🌍', color: 'from-green-500 to-green-600' },
                { name: 'Indian', icon: '🇮🇳', color: 'from-orange-500 to-orange-600' },
                { name: 'French', icon: '🇫🇷', color: 'from-indigo-500 to-indigo-600' },
                { name: 'Arabic', icon: '🇶🇦', color: 'from-purple-500 to-purple-600' },
              ].map((curriculum) => (
                <Link key={curriculum.name} href={`/schools?curriculum=${curriculum.name}`}>
                  <div className="card card-hover group cursor-pointer text-center p-6">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${curriculum.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <span className="text-4xl">{curriculum.icon}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{curriculum.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="hero-gradient py-20">
          <div className="container-responsive text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Find Your Perfect School?
              </h2>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                Join 8,500+ families who have found their ideal educational environment in Doha. Search 433 verified schools with real contact information, GPS locations, and transparent fees.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/schools">
                  <button className="btn bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 text-lg px-8 py-4 shadow-2xl group">
                    Start Searching Now
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </Link>
                <Link href="/blog">
                  <button className="btn bg-white/10 backdrop-blur-md text-white border-2 border-white/30 hover:bg-white/20 text-lg px-8 py-4">
                    Read Our Blog
                  </button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
                {[
                  { label: 'Schools', value: '433', icon: '🏫' },
                  { label: 'Verified Phones', value: '367', icon: '📞' },
                  { label: 'Happy Families', value: '8,500+', icon: '👨‍👩‍👧‍👦' },
                  { label: 'Data Coverage', value: '84.8%', icon: '✨' },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-5xl mb-2">{stat.icon}</div>
                    <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-blue-200 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
