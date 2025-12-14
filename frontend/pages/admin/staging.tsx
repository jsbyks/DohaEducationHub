import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { API_BASE_URL } from '../../lib/api';

interface StagingSchool {
  id: number;
  name: string;
  type?: string;
  curriculum?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  contact?: string;
  website?: string;
  status: string;
  completeness_score: number;
  created_at: string;
}

type StatusFilter = 'all' | 'staging' | 'possible_duplicate' | 'invalid_geocode' | 'incomplete';

export default function AdminStagingPage() {
  const API_BASE = API_BASE_URL || '';
  const [schools, setSchools] = useState<StagingSchool[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<StagingSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedSchools, setSelectedSchools] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'date'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [processing, setProcessing] = useState(false);

  const fetchStagingSchools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/api/schools/staging/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch staging schools');
      }

      const data = await response.json();
      setSchools(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load staging schools');
      console.error('Error fetching staging schools:', err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchStagingSchools();
  }, [fetchStagingSchools]);

  useEffect(() => {
    let filtered = [...schools];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'score':
          comparison = a.completeness_score - b.completeness_score;
          break;
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredSchools(filtered);
  }, [schools, statusFilter, sortBy, sortOrder]);

  const applyFiltersAndSort = () => {
    let filtered = [...schools];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'score':
          comparison = a.completeness_score - b.completeness_score;
          break;
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredSchools(filtered);
  };

  const toggleSchoolSelection = (schoolId: number) => {
    const newSelected = new Set(selectedSchools);
    if (newSelected.has(schoolId)) {
      newSelected.delete(schoolId);
    } else {
      newSelected.add(schoolId);
    }
    setSelectedSchools(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedSchools.size === filteredSchools.length) {
      setSelectedSchools(new Set());
    } else {
      setSelectedSchools(new Set(filteredSchools.map(s => s.id)));
    }
  };

  const bulkAccept = async () => {
    if (selectedSchools.size === 0) {
      alert('Please select schools to accept');
      return;
    }

    if (!confirm(`Accept ${selectedSchools.size} selected schools?`)) {
      return;
    }

    setProcessing(true);
    const token = localStorage.getItem('access_token');
    let successful = 0;
    let failed = 0;

    for (const schoolId of Array.from(selectedSchools)) {
      try {
        const response = await fetch(`${API_BASE}/api/schools/staging/${schoolId}/accept`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          successful++;
        } else {
          failed++;
        }
      } catch (err) {
        failed++;
        console.error(`Error accepting school ${schoolId}:`, err);
      }
    }

    setProcessing(false);
    alert(`Accepted: ${successful}, Failed: ${failed}`);
    setSelectedSchools(new Set());
    fetchStagingSchools();
  };

  const bulkReject = async () => {
    if (selectedSchools.size === 0) {
      alert('Please select schools to reject');
      return;
    }

    if (!confirm(`Reject (delete) ${selectedSchools.size} selected schools?`)) {
      return;
    }

    setProcessing(true);
    const token = localStorage.getItem('access_token');
    let successful = 0;
    let failed = 0;

    for (const schoolId of Array.from(selectedSchools)) {
      try {
        const response = await fetch(`${API_BASE}/api/schools/staging/${schoolId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          successful++;
        } else {
          failed++;
        }
      } catch (err) {
        failed++;
        console.error(`Error rejecting school ${schoolId}:`, err);
      }
    }

    setProcessing(false);
    alert(`Rejected: ${successful}, Failed: ${failed}`);
    setSelectedSchools(new Set());
    fetchStagingSchools();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    if (score >= 40) return 'bg-orange-600';
    return 'bg-red-600';
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      staging: 'bg-blue-100 text-blue-800',
      possible_duplicate: 'bg-purple-100 text-purple-800',
      invalid_geocode: 'bg-red-100 text-red-800',
      incomplete: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading staging schools...</p>
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
            <h1 className="text-3xl font-bold mb-2">Staging School Management</h1>
            <p className="text-primary-100">Review and approve schools before publishing</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation */}
          <div className="mb-6">
            <Link href="/admin" className="text-primary-600 hover:text-primary-800">
              ← Back to Admin Dashboard
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Filter Tabs */}
          <Card className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({schools.length})
              </button>
              <button
                onClick={() => setStatusFilter('staging')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'staging'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Staging ({schools.filter(s => s.status === 'staging').length})
              </button>
              <button
                onClick={() => setStatusFilter('possible_duplicate')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'possible_duplicate'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Duplicates ({schools.filter(s => s.status === 'possible_duplicate').length})
              </button>
              <button
                onClick={() => setStatusFilter('invalid_geocode')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'invalid_geocode'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Invalid Geocode ({schools.filter(s => s.status === 'invalid_geocode').length})
              </button>
              <button
                onClick={() => setStatusFilter('incomplete')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'incomplete'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Incomplete ({schools.filter(s => s.status === 'incomplete').length})
              </button>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-4">
              <label htmlFor="sortBySelect" className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                id="sortBySelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="score">Completeness Score</option>
                <option value="name">Name</option>
                <option value="date">Date Added</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </button>
            </div>
          </Card>

          {/* Bulk Actions */}
          {selectedSchools.size > 0 && (
            <Card className="mb-6 bg-primary-50 border-primary-200">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">
                  {selectedSchools.size} school(s) selected
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={bulkAccept}
                    disabled={processing}
                    variant="primary"
                    size="sm"
                  >
                    {processing ? 'Processing...' : 'Accept Selected'}
                  </Button>
                  <Button
                    onClick={bulkReject}
                    disabled={processing}
                    variant="secondary"
                    size="sm"
                  >
                    {processing ? 'Processing...' : 'Reject Selected'}
                  </Button>
                  <Button
                    onClick={() => setSelectedSchools(new Set())}
                    variant="secondary"
                    size="sm"
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Schools Table */}
          <Card>
            {filteredSchools.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No schools found in this category
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          id="select-all-schools"
                          type="checkbox"
                          checked={selectedSchools.size === filteredSchools.length}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                          title="Select all schools"
                        />
                        <label htmlFor="select-all-schools" className="sr-only">
                          Select all schools
                        </label>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        School Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type / Curriculum
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quality Score
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSchools.map((school) => (
                      <tr key={school.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <input
                            id={`select-school-${school.id}`}
                            type="checkbox"
                            checked={selectedSchools.has(school.id)}
                            onChange={() => toggleSchoolSelection(school.id)}
                            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                          />
                          <label htmlFor={`select-school-${school.id}`} className="sr-only">
                            Select {school.name}
                          </label>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-medium text-gray-900">{school.name}</div>
                          {school.address && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {school.address}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">{school.type || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{school.curriculum || 'N/A'}</div>
                        </td>
                        <td className="px-4 py-4">
                          {getStatusBadge(school.status)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getScoreColor(school.completeness_score)}`}>
                              {school.completeness_score}
                            </span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getScoreBarColor(school.completeness_score)}`}
                                style={{ width: `${school.completeness_score}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                const token = localStorage.getItem('access_token');
                                try {
                                  await fetch(`${API_BASE}/api/schools/staging/${school.id}/accept`, {
                                    method: 'POST',
                                    headers: { 'Authorization': `Bearer ${token}` },
                                  });
                                  fetchStagingSchools();
                                } catch (err) {
                                  alert('Failed to accept school');
                                }
                              }}
                              className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                              Accept
                            </button>
                            <button
                              onClick={async () => {
                                if (!confirm(`Delete ${school.name}?`)) return;
                                const token = localStorage.getItem('access_token');
                                try {
                                  await fetch(`${API_BASE}/api/schools/staging/${school.id}`, {
                                    method: 'DELETE',
                                    headers: { 'Authorization': `Bearer ${token}` },
                                  });
                                  fetchStagingSchools();
                                } catch (err) {
                                  alert('Failed to reject school');
                                }
                              }}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
