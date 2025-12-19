import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SEO from '../../components/SEO';
import { useComparison } from '../../contexts/ComparisonContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import Toast from '../../components/Toast';
import { School } from '../../lib/api';

interface SavedComparison {
  id: string;
  name: string;
  schools: School[];
  createdAt: string;
}

export default function SchoolComparisonPage() {
  const router = useRouter();
  const { selectedSchools, addSchool, removeSchool, clearAll } = useComparison();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'table' | 'charts'>('table');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [comparisonName, setComparisonName] = useState('');
  const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load schools from URL parameters
  useEffect(() => {
    const { schools: schoolIds } = router.query;
    if (schoolIds && typeof schoolIds === 'string') {
      const ids = schoolIds.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      // Note: In a real app, you'd fetch school data by IDs here
      // For now, we'll assume schools are loaded elsewhere
    }
  }, [router.query]);

  // Save comparison function
  const saveComparison = () => {
    if (!user || !comparisonName.trim()) return;

    const newComparison: SavedComparison = {
      id: Date.now().toString(),
      name: comparisonName.trim(),
      schools: selectedSchools,
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedComparisons, newComparison];
    setSavedComparisons(updated);
    localStorage.setItem(`comparisons_${user.id}`, JSON.stringify(updated));
    setShowSaveDialog(false);
    setComparisonName('');
    setToast({ message: 'Comparison saved successfully!', type: 'success' });
  };

  // Load comparison function
  const loadComparison = (comparison: SavedComparison) => {
    clearAll();
    comparison.schools.forEach(school => addSchool(school));
    setToast({ message: 'Comparison loaded successfully!', type: 'success' });
  };

  // Delete comparison function
  const deleteComparison = (id: string) => {
    const updated = savedComparisons.filter(c => c.id !== id);
    setSavedComparisons(updated);
    localStorage.setItem(`comparisons_${user.id}`, JSON.stringify(updated));
    setToast({ message: 'Comparison deleted!', type: 'success' });
  };

  // Copy shareable link function
  const copyShareableLink = () => {
    const schoolIds = selectedSchools.map(s => s.id).join(',');
    const url = `${window.location.origin}/schools/compare?schools=${schoolIds}`;
    navigator.clipboard.writeText(url);
    setToast({ message: 'Shareable link copied to clipboard!', type: 'success' });
  };

  // Export to PDF function (enhanced)
  const exportToPDF = () => {
    window.print(); // For now, use browser print which can save as PDF
  };

  // Load saved comparisons for authenticated users
  useEffect(() => {
    if (user) {
      loadSavedComparisons();
    }
  }, [user]);

  const loadSavedComparisons = async () => {
    // TODO: Implement API call to load saved comparisons
    // For now, load from localStorage
    try {
      const saved = localStorage.getItem('saved_school_comparisons');
      if (saved) {
        setSavedComparisons(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to load saved comparisons', err);
    }
  };

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

  // Extract fee data for charts
  const getFeeData = () => {
    return selectedSchools.map(school => {
      let avgFee = 0;
      if (school.fee_structure) {
        if (typeof school.fee_structure === 'string') {
          try {
            const fees = JSON.parse(school.fee_structure);
            if (typeof fees === 'object') {
              const feeValues = Object.values(fees).filter(v => typeof v === 'number') as number[];
              if (feeValues.length > 0) {
                avgFee = feeValues.reduce((a, b) => a + b, 0) / feeValues.length;
              }
            }
          } catch (e) {
            // Ignore parsing errors
          }
        }
      }
      return {
        name: school.name.length > 15 ? school.name.substring(0, 15) + '...' : school.name,
        fee: avgFee,
        fullName: school.name,
      };
    }).filter(item => item.fee > 0);
  };

  // Simple bar chart component
  const FeeComparisonChart = () => {
    const data = getFeeData();
    if (data.length === 0) return null;

    const maxFee = Math.max(...data.map(d => d.fee));
    const chartHeight = 200;

    return (
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Annual Fees Comparison</h3>
          <div className="space-y-4">
            {data.map((item, index) => {
              const percentage = (item.fee / maxFee) * 100;
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];

              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium text-gray-700 truncate" title={item.fullName}>
                    {item.name}
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-6">
                        <div
                          className={`h-6 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          QAR {item.fee.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    );
  };

  // Curriculum distribution chart
  const CurriculumChart = () => {
    const curriculumCount: { [key: string]: number } = {};
    selectedSchools.forEach(school => {
      const curr = school.curriculum || 'Not specified';
      curriculumCount[curr] = (curriculumCount[curr] || 0) + 1;
    });

    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];

    return (
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Curriculum Distribution</h3>
          <div className="space-y-3">
            {Object.entries(curriculumCount).map(([curriculum, count], index) => (
              <div key={curriculum} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{curriculum}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${colors[index % colors.length]}`}></div>
                  <span className="text-sm text-gray-600">{count} school{count > 1 ? 's' : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
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
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-2">School Comparison</h1>
            <p className="text-primary-100">Compare {selectedSchools.length} schools side-by-side</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Link href="/schools" className="text-primary-600 hover:text-primary-800">
              ← Back to Schools
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex bg-white rounded-lg border">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                    viewMode === 'table'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Table View
                </button>
                <button
                  onClick={() => setViewMode('charts')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                    viewMode === 'charts'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Charts View
                </button>
              </div>

              {/* Action Buttons */}
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear All
              </Button>

              {user && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaveDialog(true)}
                  disabled={selectedSchools.length < 2}
                >
                  Save Comparison
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={copyShareableLink}
                disabled={selectedSchools.length < 2}
              >
                Share Link
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={exportToPDF}
              >
                Export PDF
              </Button>
            </div>
          </div>

          {/* Save Comparison Dialog */}
          {showSaveDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Comparison</h3>
                  <Input
                    label="Comparison Name"
                    value={comparisonName}
                    onChange={(e) => setComparisonName(e.target.value)}
                    placeholder="e.g., Top International Schools"
                    required
                  />
                  <div className="flex gap-3 mt-6">
                    <Button onClick={saveComparison} className="flex-1">
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowSaveDialog(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Saved Comparisons */}
          {user && savedComparisons.length > 0 && (
            <Card className="mb-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Saved Comparisons</h3>
                <div className="space-y-2">
                  {savedComparisons.map((comparison) => (
                    <div key={comparison.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{comparison.name}</p>
                        <p className="text-sm text-gray-600">
                          {comparison.schools.length} schools • {new Date(comparison.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => loadComparison(comparison)}
                        >
                          Load
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteComparison(comparison.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Content based on view mode */}
          {viewMode === 'charts' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FeeComparisonChart />
              <CurriculumChart />

              {/* Additional comparison insights */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Total Schools:</span>
                      <span className="font-semibold">{selectedSchools.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Curriculum Types:</span>
                      <span className="font-semibold">
                        {new Set(selectedSchools.map(s => s.curriculum).filter(Boolean)).size}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">School Types:</span>
                      <span className="font-semibold">
                        {new Set(selectedSchools.map(s => s.type).filter(Boolean)).size}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">With Verified Contact:</span>
                      <span className="font-semibold">
                        {selectedSchools.filter(s => s.contact).length}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            /* Table View */
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
          )}

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
