import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../../lib/api';

// Use the configured API base (falls back to same-origin if env missing)
const API_BASE = API_BASE_URL || '';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

interface DataQualityStats {
  total_schools: number;
  average_score: number;
  min_score: number;
  max_score: number;
  distribution: {
    '0-20': number;
    '21-40': number;
    '41-60': number;
    '61-80': number;
    '81-100': number;
  };
  by_status: {
    [key: string]: number;
  };
  missing_fields: {
    [key: string]: number;
  };
}

export default function DataQualityPage() {
  const [stats, setStats] = useState<DataQualityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recalculating, setRecalculating] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/api/admin/data-quality`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data quality stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load data quality statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const recalculateScores = async () => {
    if (!confirm('Recalculate completeness scores for all schools? This may take a moment.')) {
      return;
    }

    setRecalculating(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/api/admin/recalculate-scores`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to recalculate scores');
      }

      alert('Scores recalculated successfully!');
      fetchStats();
    } catch (err: any) {
      alert(err.message || 'Failed to recalculate scores');
    } finally {
      setRecalculating(false);
    }
  };

  const getScoreColor = (range: string) => {
    switch (range) {
      case '81-100':
        return 'bg-green-500';
      case '61-80':
        return 'bg-yellow-500';
      case '41-60':
        return 'bg-orange-500';
      case '21-40':
        return 'bg-red-400';
      case '0-20':
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading data quality statistics...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-2">Data Quality Dashboard</h1>
            <p className="text-primary-100">Monitor and improve school data completeness</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <Link href="/admin" className="text-primary-600 hover:text-primary-800">
              ← Back to Admin Dashboard
            </Link>
            <Button
              onClick={recalculateScores}
              disabled={recalculating}
              size="sm"
            >
              {recalculating ? 'Recalculating...' : 'Recalculate Scores'}
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {stats && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="text-center">
                  <div className="text-3xl font-bold text-primary-600">{stats.total_schools}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Schools</div>
                </Card>

                <Card className="text-center">
                  <div className="text-3xl font-bold text-primary-600">
                    {stats.average_score.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Average Score</div>
                </Card>

                <Card className="text-center">
                  <div className="text-3xl font-bold text-red-600">{stats.min_score}</div>
                  <div className="text-sm text-gray-600 mt-1">Minimum Score</div>
                </Card>

                <Card className="text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.max_score}</div>
                  <div className="text-sm text-gray-600 mt-1">Maximum Score</div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Score Distribution */}
                <Card>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Score Distribution</h2>
                  <div className="space-y-4">
                    {Object.entries(stats.distribution).map(([range, count]) => {
                      const percentage =
                        stats.total_schools > 0 ? (count / stats.total_schools) * 100 : 0;
                      return (
                        <div key={range}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{range}</span>
                            <span className="text-sm text-gray-600">
                              {count} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full ${getScoreColor(range)}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">
                      Score Breakdown:
                    </h3>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Critical fields (name, address, coordinates): 15 points each</li>
                      <li>• Important fields (contact, website, curriculum, type): 10 points each</li>
                      <li>• Optional fields (fee structure, facilities): 5 points each</li>
                    </ul>
                  </div>
                </Card>

                {/* Status Distribution */}
                <Card>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Schools by Status</h2>
                  <div className="space-y-3">
                    {Object.entries(stats.by_status).map(([status, count]) => {
                      const percentage =
                        stats.total_schools > 0 ? (count / stats.total_schools) * 100 : 0;
                      return (
                        <div
                          key={status}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {status.replace('_', ' ')}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{count}</span>
                            <span className="text-xs text-gray-500">
                              ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* Missing Fields Report */}
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Missing Fields Report</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Number of schools missing each field (sorted by frequency)
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(stats.missing_fields)
                    .sort((a, b) => b[1] - a[1])
                    .filter(([_, count]) => count > 0)
                    .map(([field, count]) => {
                      const percentage =
                        stats.total_schools > 0 ? (count / stats.total_schools) * 100 : 0;
                      return (
                        <div
                          key={field}
                          className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                        >
                          <div className="text-lg font-semibold text-gray-900 capitalize">
                            {field.replace('_', ' ')}
                          </div>
                          <div className="text-2xl font-bold text-red-600 mt-2">{count}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            {percentage.toFixed(1)}% missing
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {Object.values(stats.missing_fields).every((count) => count === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    All schools have complete data - no missing fields!
                  </div>
                )}
              </Card>

              {/* Recommendations */}
              <Card className="mt-6 bg-yellow-50 border-yellow-200">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Recommendations</h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  {stats.average_score < 70 && (
                    <li className="flex items-start">
                      <span className="text-yellow-600 mr-2">⚠</span>
                      Average completeness score is below 70. Consider enriching school data with
                      missing fields.
                    </li>
                  )}
                  {stats.distribution['0-20'] > 0 && (
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">⚠</span>
                      {stats.distribution['0-20']} schools have very low completeness scores (0-20).
                      Review these schools for data quality issues.
                    </li>
                  )}
                  {Object.entries(stats.missing_fields).filter(([_, count]) => count > stats.total_schools * 0.5).length > 0 && (
                    <li className="flex items-start">
                      <span className="text-yellow-600 mr-2">⚠</span>
                      Some fields are missing in over 50% of schools. Focus on collecting:{' '}
                      {Object.entries(stats.missing_fields)
                        .filter(([_, count]) => count > stats.total_schools * 0.5)
                        .map(([field]) => field)
                        .join(', ')}
                    </li>
                  )}
                  {stats.average_score >= 80 && (
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      Great job! Data quality is high with an average score of{' '}
                      {stats.average_score.toFixed(1)}.
                    </li>
                  )}
                </ul>
              </Card>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
