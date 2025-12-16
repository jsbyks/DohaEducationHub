import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../../components/AdminLayout'
import { useAuth } from '../../../contexts/AuthContext'
import { schoolsAPI, School, UPLOADS_BASE_URL } from '../../../lib/api'
import { Button } from '../../../components/Button'
import { Input } from '../../../components/Input'
import { Select } from '../../../components/Select'
import Toast from '../../../components/Toast'
import { ImageUpload } from '../../../components/ImageUpload'

export default function AdminSchoolEditPage() {
  const router = useRouter()
  const { id } = router.query
  const { user, loading: authLoading } = useAuth()
  const [school, setSchool] = useState<School | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type?: string } | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    curriculum: '',
    address: '',
    latitude: '',
    longitude: '',
    contact: '',
    website: '',
    fee_structure: '',
    facilities: '',
    photos: [] as string[],
    status: 'pending'
  })

  useEffect(() => {
    if (authLoading) return
    if (!user || !user.is_admin) return
    if (!id) return

    fetchSchool()
  }, [user, authLoading, id])

  const fetchSchool = async () => {
    try {
      setLoading(true)
      const data = await schoolsAPI.get(parseInt(id as string))
      setSchool(data)
      setFormData({
        name: data.name || '',
        type: data.type || '',
        curriculum: data.curriculum || '',
        address: data.address || '',
        latitude: data.latitude?.toString() || '',
        longitude: data.longitude?.toString() || '',
        contact: data.contact || '',
        website: data.website || '',
        fee_structure: data.fee_structure ? JSON.stringify(data.fee_structure, null, 2) : '',
        facilities: data.facilities ? data.facilities.join('\n') : '',
        photos: data.photos || [],
        status: data.status || 'pending'
      })
    } catch (err: any) {
      setToast({ message: 'Failed to load school', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const updateData = {
        name: formData.name,
        type: formData.type || undefined,
        curriculum: formData.curriculum || undefined,
        address: formData.address || undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        contact: formData.contact || undefined,
        website: formData.website || undefined,
        fee_structure: formData.fee_structure ? JSON.parse(formData.fee_structure) : undefined,
        facilities: formData.facilities ? formData.facilities.split('\n').filter(f => f.trim()) : undefined,
        photos: formData.photos,
        status: formData.status
      }

      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Authentication required');

      await schoolsAPI.update(parseInt(id as string), updateData, token)
      setToast({ message: 'School updated successfully', type: 'success' })
      router.push('/admin/schools')
    } catch (err: any) {
      setToast({ message: err.response?.data?.detail || 'Failed to update school', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    const token = localStorage.getItem('access_token')
    if (!token) throw new Error('Authentication required')

    const formData = new FormData()
    formData.append('file', file)

    const base = process.env.NEXT_PUBLIC_BASE_URL || ''
    const response = await fetch(`${base}/api/proxy/api/uploads/school/${id}/photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const result = await response.json()
    const photoUrl = result.photo_url

    // Add to photos array
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, photoUrl]
    }))

    return photoUrl
  }

  const handleImageDelete = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  if (authLoading || loading) return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>
  if (!user || !user.is_admin) return <AdminLayout><div className="p-8 text-red-600">Unauthorized</div></AdminLayout>
  if (!school) return <AdminLayout><div className="p-8">School not found</div></AdminLayout>

  return (
    <AdminLayout>
      {toast && <Toast message={toast.message} type={toast.type as any} onClose={() => setToast(null)} />}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Edit School</h1>
          <Button variant="outline" onClick={() => router.push('/admin/schools')}>Back to Schools</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="School Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'published', label: 'Published' },
                  { value: 'draft', label: 'Draft' }
                ]}
              />
              <Select
                label="Type"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                options={[
                  { value: '', label: 'Select Type' },
                  { value: 'Primary', label: 'Primary' },
                  { value: 'Secondary', label: 'Secondary' },
                  { value: 'All-through', label: 'All-through' }
                ]}
              />
              <Select
                label="Curriculum"
                value={formData.curriculum}
                onChange={(e) => setFormData(prev => ({ ...prev, curriculum: e.target.value }))}
                options={[
                  { value: '', label: 'Select Curriculum' },
                  { value: 'British', label: 'British' },
                  { value: 'American', label: 'American' },
                  { value: 'IB', label: 'IB' },
                  { value: 'Arabic', label: 'Arabic' },
                  { value: 'Indian', label: 'Indian' },
                  { value: 'French', label: 'French' }
                ]}
              />
            </div>
          </div>

          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Location & Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <Input
                label="Latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
              />
              <Input
                label="Longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
              />
              <Input
                label="Contact"
                value={formData.contact}
                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
              />
              <Input
                label="Website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
          </div>

          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Photos</h2>
            <div className="space-y-4">
              <ImageUpload
                onUpload={handleImageUpload}
                label="Upload School Photo"
              />
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img src={`${UPLOADS_BASE_URL}${photo}`} alt={`School photo ${index + 1}`} className="w-full h-32 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => handleImageDelete(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fee Structure (JSON)</label>
                <textarea
                  value={formData.fee_structure}
                  onChange={(e) => setFormData(prev => ({ ...prev, fee_structure: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  placeholder='{"annual": "15000 QAR", "monthly": "1250 QAR"}'
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facilities (one per line)</label>
                <textarea
                  value={formData.facilities}
                  onChange={(e) => setFormData(prev => ({ ...prev, facilities: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  placeholder="Swimming Pool&#10;Sports Facilities&#10;Library"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/admin/schools')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}