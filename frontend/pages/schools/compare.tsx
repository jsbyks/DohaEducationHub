import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SEO from '../../components/SEO';
import { useComparison } from '../../contexts/ComparisonContext';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

export default function SchoolComparisonPage() {
  const router = useRouter();
  const { selectedSchools, removeSchool, clearAll } = useComparison();

  if (selectedSchools.length === 0) {
    return (
      <>
        <SEO
          title="Compare Schools"
          description="Compare schools side-by-side to find the perfect fit for your child"
          path="/schools/compare"
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <Card>
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">No Schools Selected</h1>
              <p className="text-gray-600 mb-6">
                Select at least 2 schools from the schools page to compare them side-by-side.
              </p>
              <Link href="/schools">
                <Button>Browse Schools</Button>
              </Link>
            </div>
          </Card>
        </div>
      </>
    );
  }

  if (selectedSchools.length === 1) {
    return (
      <>
        <SEO
          title="Compare Schools"
          description="Compare schools side-by-side to find the perfect fit for your child"
          path="/schools/compare"
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <Card>
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Add More Schools</h1>
              <p className="text-gray-600 mb-6">
                You need at least 2 schools to compare. Currently selected: {selectedSchools[0].name}
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/schools">
                  <Button>Add More Schools</Button>
                </Link>
                <Button variant="outline" onClick={clearAll}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </>
    );
  }

  const formatFees = (feeStructure: any) => {
    if (!feeStructure) return 'Not available';
    if (typeof feeStructure === 'string') {
      try {
        feeStructure = JSON.parse(feeStructure);
      } catch {
        return feeStructure;
      }
    }
    if (typeof feeStructure === 'object') {
      return Object.entries(feeStructure)
        .map(([grade, fee]) => `${grade}: ${fee}`)
        .join(', ');
    }
    return 'Not available';
  };

  const formatFacilities = (facilities: string[] | any) => {
    if (!facilities) return 'Not available';
    if (typeof facilities === 'string') {
      try {
        facilities = JSON.parse(facilities);
      } catch {
        return facilities;
      }
    }
    if (Array.isArray(facilities)) {
      return facilities.join(', ') || 'Not available';
    }
    return 'Not available';
  };

  const comparisonRows = [
    { label: 'School Name', getValue: (school: any) => school.name },
    { label: 'Curriculum', getValue: (school: any) => school.curriculum || 'Not specified' },
    { label: 'School Type', getValue: (school: any) => school.type || 'Not specified' },
    { label: 'Address', getValue: (school: any) => school.address || 'Not available' },
    { label: 'Contact', getValue: (school: any) => school.contact || 'Not available' },
    { label: 'Website', getValue: (school: any) => school.website ? (
      <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 underline">
        Visit
      </a>
    ) : 'Not available' },
    { label: 'Facilities', getValue: (school: any) => formatFacilities(school.facilities) },
    { label: 'Fee Structure', getValue: (school: any) => formatFees(school.fee_structure) },
  ];

  return (
    <>
      <SEO
        title="Compare Schools"
        description="Compare schools side-by-side to find the perfect fit for your child"
        path="/schools/compare"
      />

      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-2">School Comparison</h1>
            <p className="text-primary-100">Compare {selectedSchools.length} schools side-by-side</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Actions */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/schools" className="text-primary-600 hover:text-primary-800">
              ← Back to Schools
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
              >
                Print / Save as PDF
              </Button>
            </div>
          </div>

          {/* Comparison Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                      Feature
                    </th>
                    {selectedSchools.map((school) => (
                      <th key={school.id} className="px-6 py-3 text-left text-sm font-medium text-gray-900 min-w-[250px]">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold">{school.name}</div>
                            <Link href={`/schools/${school.id}`}>
                              <span className="text-xs text-primary-600 hover:text-primary-800">
                                View Details →
                              </span>
                            </Link>
                          </div>
                          <button
                            onClick={() => removeSchool(school.id)}
                            className="text-gray-400 hover:text-red-600"
                            aria-label={`Remove ${school.name}`}
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-inherit z-10">
                        {row.label}
                      </td>
                      {selectedSchools.map((school) => (
                        <td key={school.id} className="px-6 py-4 text-sm text-gray-700">
                          <div className="max-w-xs break-words">
                            {row.getValue(school)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Bottom Actions */}
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/schools">
              <Button variant="outline">
                Add More Schools
              </Button>
            </Link>
            {selectedSchools.map((school) => (
              <Link key={school.id} href={`/schools/${school.id}`}>
                <Button variant="outline" size="sm">
                  View {school.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
