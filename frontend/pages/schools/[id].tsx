import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import SEO from '../../components/SEO';
import Link from 'next/link';
import { schoolsAPI, School } from '../../lib/api';
import { Button } from '../../components/Button';
import { FavoriteButton } from '../../components/FavoriteButton';
import { ReviewList } from '../../components/ReviewList';
import { ReviewForm } from '../../components/ReviewForm';
import { imageApi } from '../../lib/imageApi';
import { useComparison } from '../../contexts/ComparisonContext';
import GoogleMap from '../../components/GoogleMap';

export default function SchoolDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const { isSelected, addSchool, removeSchool, maxReached } = useComparison();

  const fetchSchool = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await schoolsAPI.get(Number(id));
      setSchool(data);

      // Fetch appropriate featured image
      if (data.type === 'Kindergarten') {
        const img = await imageApi.getKindergartenImage();
        setFeaturedImage(img);
      } else if (data.curriculum) {
        const img = await imageApi.getCurriculumImage(data.curriculum);
        setFeaturedImage(img);
      } else {
        const img = await imageApi.getFeaturedImage('school');
        setFeaturedImage(img);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load school details');
      console.error('Error fetching school:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchSchool();
    }
  }, [id, fetchSchool]);

  const handleCompareToggle = () => {
    if (!school) return;
    if (isSelected(school.id)) {
      removeSchool(school.id);
    } else {
      if (!maxReached) {
        addSchool(school);
      }
    }
  };

  const formatFacilityName = (facility: string) => {
    return facility
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderFeeStructure = (feeStructure: any) => {
    if (!feeStructure || typeof feeStructure !== 'object') return null;

    return (
      <div className="space-y-3">
        {Object.entries(feeStructure).map(([grade, fee]) => (
          <div key={grade} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{grade}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold gradient-text-ocean">{String(fee)}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
        {/* Loading Hero Skeleton */}
        <div className="relative h-64 md:h-96 bg-gradient-to-r from-blue-100 to-cyan-100 animate-pulse">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <main className="lg:col-span-2 space-y-6">
              <div className="card p-8">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                </div>
              </div>
            </main>
            <aside className="lg:col-span-1">
              <div className="card p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-gray-50">
        <div className="max-w-md w-full card card-gradient p-12 text-center">
          <svg className="w-20 h-20 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-3xl font-bold gradient-text-ocean mb-4">
            {error || 'School Not Found'}
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            The school you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/schools">
            <button className="btn btn-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Browse All Schools
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const schema: any = {
    '@type': 'EducationalOrganization',
    name: school.name,
    url: school.website || `${process.env.NEXT_PUBLIC_BASE_URL}/schools/${school.id}`,
  };
  if (school.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: school.address,
      addressLocality: 'Doha',
      addressCountry: 'QA',
    };
  }
  if (school.contact) schema.telephone = school.contact;
  if (school.website) schema.sameAs = [school.website];
  if (school.latitude && school.longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: school.latitude,
      longitude: school.longitude,
    };
  }

  const selected = isSelected(school.id);

  return (
    <>
      <SEO
        title={school.name}
        description={`Learn more about ${school.name} - ${school.curriculum || ''} ${school.type || ''} school in ${school.address || 'Doha, Qatar'}`}
        path={`/schools/${school.id}`}
        image={featuredImage || '/placeholder-school.jpg'}
        type="website"
        schema={schema}
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
        {/* Hero Section with Featured Image */}
        <div className="relative h-72 md:h-[500px] overflow-hidden">
          {/* Featured Image */}
          <div className="absolute inset-0">
            <img
              src={featuredImage || imageApi.getPlaceholderImage(1600, 900)}
              alt={school.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>

          {/* Animated Accent */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20"></div>

          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between py-8">
            {/* Back Button */}
            <div>
              <Link href="/schools">
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white font-semibold transition-all hover:scale-105">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Schools
                </button>
              </Link>
            </div>

            {/* Title and Badges */}
            <div className="space-y-6 pb-8">
              {/* Badges */}
              <div className="flex flex-wrap gap-3">
                {school.type && (
                  <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-bold rounded-full shadow-lg">
                    {school.type}
                  </span>
                )}
                {school.curriculum && (
                  <span className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-bold rounded-full shadow-lg">
                    {school.curriculum} Curriculum
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl animate-fade-in-up">
                {school.name}
              </h1>

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                {school.address && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">{school.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Column */}
            <main className="lg:col-span-2 space-y-8">
              {/* Contact Information Card */}
              <div className="card card-gradient p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCompareToggle}
                      className={`btn ${selected ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      {selected ? 'Added' : 'Compare'}
                    </button>
                    <FavoriteButton schoolId={school.id} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Address */}
                  {school.address && (
                    <div className="flex items-start gap-4 p-4 bg-white rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
                        <p className="text-gray-900 font-medium">{school.address}</p>
                      </div>
                    </div>
                  )}

                  {/* Contact */}
                  {school.contact && (
                    <div className="flex items-start gap-4 p-4 bg-white rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
                        <a href={`tel:${school.contact}`} className="text-gray-900 font-medium hover:text-blue-600">
                          {school.contact}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Website */}
                  {school.website && (
                    <div className="flex items-start gap-4 p-4 bg-white rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">Website</p>
                        <a
                          href={school.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}

                  {/* GPS Coordinates */}
                  {school.latitude && school.longitude && (
                    <div className="flex items-start gap-4 p-4 bg-white rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">GPS Coordinates</p>
                        <p className="text-gray-900 font-mono text-sm">
                          {school.latitude.toFixed(4)}, {school.longitude.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Fee Structure Card */}
              {school.fee_structure && (
                <div className="card card-gradient p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Fee Structure</h2>
                  </div>
                  {renderFeeStructure(school.fee_structure)}
                </div>
              )}

              {/* Facilities Card */}
              {school.facilities && school.facilities.length > 0 && (
                <div className="card card-gradient p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Facilities & Amenities</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {school.facilities.map((facility, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{formatFacilityName(facility)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              <div className="card card-gradient p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Ratings</h2>
                <div className="space-y-6">
                  <ReviewList schoolId={school.id} />
                </div>
              </div>
            </main>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Quick Actions Card */}
                <div className="card hero-gradient p-6 text-center">
                  <svg className="w-16 h-16 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="text-xl font-bold text-white mb-3">Ready to Apply?</h3>
                  <p className="text-blue-100 text-sm mb-6">
                    Visit the school website to learn more about admission requirements and start your application.
                  </p>
                  {school.website ? (
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn bg-white text-blue-600 hover:bg-gray-100 w-full justify-center mb-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Visit Website
                    </a>
                  ) : (
                    <button className="btn bg-white text-blue-600 hover:bg-gray-100 w-full justify-center mb-3" disabled>
                      No Website Available
                    </button>
                  )}
                  {school.contact && (
                    <a
                      href={`tel:${school.contact}`}
                      className="btn btn-secondary w-full justify-center"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call Now
                    </a>
                  )}
                </div>

                {/* Map Card (Google Maps JS API interactive map) */}
                {school.latitude && school.longitude && (
                  <div className="card p-4 bg-white rounded-xl">
                    <p className="text-sm font-medium text-gray-500 mb-2">Location</p>
                    {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                      <div className="space-y-3">
                        <div className="w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                          <GoogleMap lat={school.latitude} lng={school.longitude} className="w-full h-full" />
                        </div>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${school.latitude},${school.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Get Directions in Google Maps
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-sm text-gray-700 font-mono">
                          {school.latitude.toFixed(5)}, {school.longitude.toFixed(5)}
                        </div>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${school.latitude},${school.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 btn btn-secondary w-full text-sm"
                        >
                          Open in Google Maps
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Write Review Card */}
                <div className="card card-gradient p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Share Your Experience</h3>
                  <ReviewForm
                    schoolId={school.id}
                    onSuccess={() => {
                      window.location.reload();
                    }}
                  />
                </div>

                {/* Browse More Card */}
                <div className="card card-gradient p-6 text-center">
                  <svg className="w-12 h-12 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Explore More Schools</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Discover other schools in Doha that might be perfect for your child.
                  </p>
                  <Link href="/schools">
                    <button className="btn btn-primary w-full justify-center">
                      Browse Schools
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </Link>
                </div>

                {/* Compare Schools Card */}
                {!selected && (
                  <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-6 text-center">
                    <svg className="w-12 h-12 text-purple-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <h3 className="text-lg font-bold text-purple-900 mb-3">Compare Schools</h3>
                    <p className="text-purple-700 text-sm mb-4">
                      Add this school to compare with others side-by-side.
                    </p>
                    <button
                      onClick={handleCompareToggle}
                      className="btn bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 w-full justify-center"
                      disabled={maxReached}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add to Compare
                    </button>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
