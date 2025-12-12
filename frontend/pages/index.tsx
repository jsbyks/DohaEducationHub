import Head from 'next/head';
import Link from 'next/link';
import { Button } from '../components/Button';

export default function Home() {
  return (
    <>
      <Head>
        <title>Doha Education Hub - Find the Perfect School in Qatar</title>
        <meta
          name="description"
          content="Discover and compare the best schools in Doha, Qatar. Find the perfect education for your child."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect School
            <span className="block text-primary-600 mt-2">in Doha, Qatar</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Search and compare schools in Doha. Discover curriculum options,
            facilities, and find the ideal educational environment for your child.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/schools">
              <Button size="lg" className="min-w-[200px]">
                Browse Schools
              </Button>
            </Link>
            <Link href="/schools">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                Advanced Search
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-4xl font-bold text-primary-600 mb-2">98+</div>
              <div className="text-gray-600">Schools Listed</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-4xl font-bold text-primary-600 mb-2">6+</div>
              <div className="text-gray-600">Curricula Available</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-4xl font-bold text-primary-600 mb-2">100%</div>
              <div className="text-gray-600">Free to Use</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose Doha Education Hub?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
                <p className="text-gray-600">
                  Filter by curriculum, location, and school type to find exactly
                  what you need.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Verified Information</h3>
                <p className="text-gray-600">
                  Accurate and up-to-date school information you can trust.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Compare Schools</h3>
                <p className="text-gray-600">
                  View detailed information to make an informed decision.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Find Your Perfect School?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Start exploring our comprehensive school directory today.
            </p>
            <Link href="/schools">
              <Button
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-100"
              >
                Start Searching Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-400">
              © 2025 Doha Education Hub. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
