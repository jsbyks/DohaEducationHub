import React, { useEffect, useState } from 'react'
import AdminLayout from '../../../components/AdminLayout'
import { useAuth } from '../../../contexts/AuthContext'
import { schoolsAPI } from '../../../lib/api'
import { Button } from '../../../components/Button'
import Toast from '../../../components/Toast'

export default function AdminSchoolsPage() {
  const { user, loading } = useAuth()
  const [schools, setSchools] = useState<any[]>([])
  const [toast, setToast] = useState<{ message: string; type?: string } | null>(null)

  useEffect(() => {
    if (loading) return
    if (!user || !user.is_admin) return

    schoolsAPI.list({ page: 1, page_size: 100 })
      .then((r) => setSchools(r.results || []))
      .catch((e) => setToast({ message: 'Failed to load schools', type: 'error' }))
  }, [user, loading])

  if (loading) return <div className="p-8">Loading...</div>
  if (!user || !user.is_admin) return <div className="p-8 text-red-600">Unauthorized</div>

  return (
    <AdminLayout>
      {toast && <Toast message={toast.message} type={toast.type as any} onClose={() => setToast(null)} />}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Manage Schools</h1>
          <Button onClick={() => window.location.href = '/admin/schools/new'}>Create School</Button>
        </div>

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">City</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {schools.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-2 text-sm text-gray-700">{s.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{s.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{s.city || s.address || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{s.status}</td>
                  <td className="px-4 py-2 text-sm text-right">
                    <Button variant="outline" onClick={() => window.location.href = `/admin/schools/${s.id}`}>Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
