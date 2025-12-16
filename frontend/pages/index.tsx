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
        title="Find Your Perfect School in Doha, Qatar"
        description="Discover and compare the best international schools in Doha. Browse curricula, facilities, fees, and connect with expert teachers. Your journey to the perfect education starts here."
        path="/"
      />

      <div className="min-h-screen">
        {/* Modern Hero Section */}
        <ModernHero
          title="Find Your Perfect School in Doha"
          subtitle="Discover world-class international schools, compare curricula and facilities, and connect with expert teachers. Everything you need to make the best educational choice for your child."
          primaryCta={{ text: 'Explore Schools', href: '/schools' }}
          secondaryCta={{ text: 'Meet Teachers', href: '/teachers' }}
          theme="education"
        />

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
                title="100% Free"
                description="No hidden fees, no subscriptions. All school information, comparisons, and resources completely free to use."
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
                Browse our curated collection of 98+ international schools in Doha
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
                Join thousands of families who have found their ideal educational environment in Doha. Start your journey today with comprehensive school information and expert guidance.
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
                  { label: 'Schools', value: '98+', icon: '🏫' },
                  { label: 'Teachers', value: '200+', icon: '👨‍🏫' },
                  { label: 'Happy Families', value: '5,000+', icon: '👨‍👩‍👧‍👦' },
                  { label: 'Success Rate', value: '100%', icon: '✨' },
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
