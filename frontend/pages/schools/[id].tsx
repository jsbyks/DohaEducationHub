import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { schoolsAPI, School } from '../../lib/api';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { FavoriteButton } from '../../components/FavoriteButton';
import { ReviewList } from '../../components/ReviewList';
import { ReviewForm } from '../../components/ReviewForm';

export default function SchoolDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchSchool();
    }
  }, [id]);

  const fetchSchool = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await schoolsAPI.get(Number(id));
      setSchool(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load school details');
      console.error('Error fetching school:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading school details...</p>
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'School not found'}
          </h2>
          <Link href="/schools">
            <Button>Back to Schools</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{school.name} | Doha Education Hub</title>
        <meta
          name="description"
          content={`Learn more about ${school.name} in ${school.address || 'Doha, Qatar'}`}
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/schools">
              <Button variant="secondary" size="sm">
                ← Back to Schools
              </Button>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* School Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-bold text-gray-900">
                {school.name}
              </h1>
              <FavoriteButton schoolId={school.id} />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {school.curriculum && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  {school.curriculum} Curriculum
                </span>
              )}
              {school.type && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {school.type}
                </span>
              )}
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address */}
              {school.address && (
                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary-600 mr-3 mt-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-900">{school.address}</p>
                  </div>
                </div>
              )}

              {/* Contact */}
              {school.contact && (
                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary-600 mr-3 mt-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contact</p>
                    <p className="text-gray-900">{school.contact}</p>
                  </div>
                </div>
              )}

              {/* Website */}
              {school.website && (
                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary-600 mr-3 mt-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Website</p>
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-800 hover:underline"
                    >
                      {school.website}
                    </a>
                  </div>
                </div>
              )}

              {/* GPS Coordinates */}
              {school.latitude && school.longitude && (
                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary-600 mr-3 mt-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      GPS Coordinates
                    </p>
                    <p className="text-gray-900">
                      {school.latitude.toFixed(4)}, {school.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Facilities Section */}
          {school.facilities && school.facilities.length > 0 && (
            <Card className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Facilities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {school.facilities.map((facility, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <svg
                      className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-gray-700">{facility}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Fee Structure */}
          {school.fee_structure && (
            <Card className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Fee Structure
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(school.fee_structure, null, 2)}
                </pre>
              </div>
            </Card>
          )}

          {/* Reviews Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Reviews</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Review List (2/3 width) */}
              <div className="lg:col-span-2">
                <ReviewList schoolId={school.id} />
              </div>

              {/* Review Form (1/3 width) */}
              <div>
                <ReviewForm
                  schoolId={school.id}
                  onSuccess={() => {
                    // Optionally trigger a refresh of the review list
                    window.location.reload();
                  }}
                />
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {school.website && (
              <a
                href={school.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full">Visit School Website</Button>
              </a>
            )}
            <Link href="/schools" className="flex-1">
              <Button variant="secondary" className="w-full">
                Browse More Schools
              </Button>
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white mt-12 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-gray-500 text-sm">
              © 2025 Doha Education Hub. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
