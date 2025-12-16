import React from 'react';
import Link from 'next/link';
import SEO from '../components/SEO';
import { Card } from '../components/Card';

export default function GovernmentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Government & Ministry Information"
        description="Official education resources, regulations, and ministry information for Qatar"
        path="/government"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Government & Ministry Information</h1>
          <p className="text-xl text-green-100">
            Official resources for education in Qatar
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <div className="mb-8">
          <Link href="/" className="text-primary-600 hover:text-primary-800">
            ← Back to Home
          </Link>
        </div>

        {/* Ministry of Education Section */}
        <Card className="mb-8">
          <div className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Ministry of Education and Higher Education (MOEHE)
                </h2>
                <p className="text-gray-600">
                  The official government body overseeing education in Qatar
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Phone:</strong> 4004 0000</p>
                  <p><strong>Email:</strong> info@edu.gov.qa</p>
                  <p><strong>Emergency:</strong> 4003 3333</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Office Hours</h3>
                <div className="space-y-2 text-gray-700">
                  <p>Sunday - Thursday: 7:00 AM - 2:00 PM</p>
                  <p>Friday - Saturday: Closed</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href="https://www.edu.gov.qa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Visit Ministry Website
              </a>
            </div>
          </div>
        </Card>

        {/* Ma'aref School Portal */}
        <Card className="mb-8">
          <div className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Ma'aref School Portal</h2>
                <p className="text-gray-600 mb-4">
                  Online portal for independent school admissions, student records, and parent services
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">What you can do on Ma'aref:</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Apply for admission to independent schools</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Track application status</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Access student records and transcripts</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>View and download certificates</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Update student information</span>
                </li>
              </ul>
            </div>

            <a
              href="https://maaref.edu.gov.qa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Access Ma'aref Portal
            </a>
          </div>
        </Card>

        {/* Education Voucher System */}
        <Card className="mb-8">
          <div className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Education Voucher System</h2>
                <p className="text-gray-600 mb-4">
                  Financial support for Qatari students attending private schools
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Eligibility</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Qatari nationals</li>
                  <li>Attending approved private schools in Qatar</li>
                  <li>Meeting academic performance requirements</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Coverage</h3>
                <p className="text-gray-700">
                  The voucher covers tuition fees up to a maximum amount set annually by the Ministry.
                  Amount varies by educational stage and school category.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Application Process</h3>
                <p className="text-gray-700 mb-2">
                  Applications are submitted through the Ma'aref portal at the beginning of each academic year.
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Voucher amounts and eligibility criteria are subject to change.
                Always verify current information with the Ministry of Education.
              </p>
            </div>
          </div>
        </Card>

        {/* School Regulations */}
        <Card className="mb-8">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">School Licensing & Regulations</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Private School Authorization</h3>
                <p className="text-gray-700 text-sm mb-2">
                  All private schools in Qatar must be licensed by the Ministry of Education and Higher Education.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Annual inspection and evaluation</li>
                  <li>Curriculum approval required</li>
                  <li>Teacher qualification standards</li>
                  <li>Facility and safety requirements</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">School Categories</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Community</span>
                    <span>Qatari-run schools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">International</span>
                    <span>Foreign curriculum schools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">Independent</span>
                    <span>Semi-autonomous public schools</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Useful Resources */}
        <Card>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Useful Resources</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="https://www.edu.gov.qa"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div className="bg-gray-100 p-2 rounded">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">School Guides</div>
                  <div className="text-sm text-gray-600">Official handbooks</div>
                </div>
              </a>

              <a
                href="https://www.psa.gov.qa"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div className="bg-gray-100 p-2 rounded">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Education Statistics</div>
                  <div className="text-sm text-gray-600">Planning & Statistics Authority</div>
                </div>
              </a>

              <a
                href="https://www.qf.org.qa"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div className="bg-gray-100 p-2 rounded">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Qatar Foundation</div>
                  <div className="text-sm text-gray-600">Education programs</div>
                </div>
              </a>
            </div>
          </div>
        </Card>

        {/* Contact Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-blue-800 text-sm">
            For questions about school admissions, regulations, or general education inquiries,
            contact the Ministry of Education Help Desk at <strong>4004 0000</strong> or email{' '}
            <a href="mailto:info@edu.gov.qa" className="underline">info@edu.gov.qa</a>
          </p>
        </div>
      </div>
    </div>
  );
}
