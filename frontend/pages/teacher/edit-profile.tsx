import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { teachersAPI, Teacher, UPLOADS_BASE_URL } from '../../lib/api';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ImageUpload } from '../../components/ImageUpload';

export default function EditTeacherProfile() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    years_experience: '',
    phone: '',
    email: '',
    city: '',
    hourly_rate_qatari: '',
    hourly_rate_online: '',
    teaches_online: true,
    teaches_in_person: true,
  });

  // Profile image state
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState<number | null>(null);

  // Multi-select state
  const [languages, setLanguages] = useState<string[]>([]);
  const [areasServed, setAreasServed] = useState<string[]>([]);
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [gradeLevels, setGradeLevels] = useState<string[]>([]);
  const [curriculaExpertise, setCurriculaExpertise] = useState<string[]>([]);

  // Temporary input fields
  const [newLanguage, setNewLanguage] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newQualification, setNewQualification] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');

  const availableGradeLevels = ['KG', 'Primary', 'Secondary', 'High School'];
  const availableCurricula = ['British', 'American', 'IB', 'Arabic', 'Indian'];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const profile = await teachersAPI.getMyProfile(token);

      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        years_experience: profile.years_experience?.toString() || '',
        phone: profile.phone || '',
        email: profile.email || '',
        city: profile.city || '',
        hourly_rate_qatari: profile.hourly_rate_qatari?.toString() || '',
        hourly_rate_online: profile.hourly_rate_online?.toString() || '',
        teaches_online: profile.teaches_online,
        teaches_in_person: profile.teaches_in_person,
      });

      setProfileImage(profile.profile_image || null);
      setTeacherId(profile.id);

      setLanguages(profile.languages || []);
      setAreasServed(profile.areas_served || []);
      setQualifications(profile.qualifications || []);
      setSpecializations(profile.specializations || []);
      setGradeLevels(profile.grade_levels || []);
      setCurriculaExpertise(profile.curricula_expertise || []);
    } catch (err) {
      setError('Failed to load profile');
      router.push('/teacher/create-profile');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const token = localStorage.getItem('access_token')
    if (!token || !teacherId) throw new Error('Authentication required')

    const formData = new FormData()
    formData.append('file', file)

    const base = process.env.NEXT_PUBLIC_BASE_URL || ''
    const response = await fetch(`${base}/api/proxy/api/uploads/teacher/${teacherId}/profile-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || 'Failed to upload image')
    }

    const data = await response.json()
    setProfileImage(data.profile_image)
    return data.profile_image
  }

  const handleImageDelete = async (): Promise<void> => {
    const token = localStorage.getItem('access_token')
    if (!token || !teacherId) throw new Error('Authentication required')

    const base = process.env.NEXT_PUBLIC_BASE_URL || ''
    const response = await fetch(`${base}/api/proxy/api/uploads/teacher/${teacherId}/profile-image`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || 'Failed to delete image')
    }

    setProfileImage(null)
  }

  const removeFromArray = (array: string[], setArray: (arr: string[]) => void, value: string) => {
    setArray(array.filter(item => item !== value));
  };

  const addToArray = (array: string[], setArray: (arr: string[]) => void, value: string, setValue: (val: string) => void) => {
    if (value.trim() && !array.includes(value.trim())) {
      setArray([...array, value.trim()]);
      setValue('');
    }
  };

  const toggleArrayItem = (array: string[], setArray: (arr: string[]) => void, value: string) => {
    if (array.includes(value)) {
      setArray(array.filter(item => item !== value));
    } else {
      setArray([...array, value]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      const profileData = {
        ...formData,
        years_experience: formData.years_experience ? parseInt(formData.years_experience) : undefined,
        hourly_rate_qatari: formData.hourly_rate_qatari ? parseFloat(formData.hourly_rate_qatari) : undefined,
        hourly_rate_online: formData.hourly_rate_online ? parseFloat(formData.hourly_rate_online) : undefined,
        languages: languages.length > 0 ? languages : undefined,
        areas_served: areasServed.length > 0 ? areasServed : undefined,
        qualifications: qualifications.length > 0 ? qualifications : undefined,
        specializations: specializations.length > 0 ? specializations : undefined,
        grade_levels: gradeLevels.length > 0 ? gradeLevels : undefined,
        curricula_expertise: curriculaExpertise.length > 0 ? curriculaExpertise : undefined,
      };

      await teachersAPI.updateMyProfile(profileData, token);
      router.push('/teacher/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/teacher/dashboard" className="text-primary-600 hover:text-primary-800">
              ← Back to Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Teacher Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Image */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Profile Image</h2>
                <ImageUpload
                  currentImage={profileImage ? `${UPLOADS_BASE_URL}${profileImage}` : undefined}
                  onUpload={handleImageUpload}
                  onDelete={handleImageDelete}
                  label="Upload Profile Image"
                />
              </div>

              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <Input label="Full Name *" name="full_name" value={formData.full_name} onChange={handleInputChange} required />
                <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                <Input label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
                <Input label="City" name="city" value={formData.city} onChange={handleInputChange} />
                <Input label="Years of Experience" name="years_experience" type="number" min="0" value={formData.years_experience} onChange={handleInputChange} />
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              {/* Languages */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Languages</h2>
                <div className="flex gap-2 mb-2">
                  <Input label="" value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} placeholder="e.g., English" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray(languages, setLanguages, newLanguage, setNewLanguage))} />
                  <Button type="button" onClick={() => addToArray(languages, setLanguages, newLanguage, setNewLanguage)} variant="secondary">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <span key={lang} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm flex items-center gap-2">
                      {lang}
                      <button type="button" onClick={() => removeFromArray(languages, setLanguages, lang)} className="text-primary-600 hover:text-primary-800">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Areas Served, Qualifications, Specializations - similar pattern */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Specializations *</h2>
                <div className="flex gap-2 mb-2">
                  <Input label="" value={newSpecialization} onChange={(e) => setNewSpecialization(e.target.value)} placeholder="e.g., Mathematics" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray(specializations, setSpecializations, newSpecialization, setNewSpecialization))} />
                  <Button type="button" onClick={() => addToArray(specializations, setSpecializations, newSpecialization, setNewSpecialization)} variant="secondary">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((spec) => (
                    <span key={spec} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm flex items-center gap-2">
                      {spec}
                      <button type="button" onClick={() => removeFromArray(specializations, setSpecializations, spec)} className="text-primary-600 hover:text-primary-800">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Grade Levels */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Grade Levels</h2>
                <div className="flex flex-wrap gap-2">
                  {availableGradeLevels.map((level) => (
                    <button key={level} type="button" onClick={() => toggleArrayItem(gradeLevels, setGradeLevels, level)} className={`px-4 py-2 rounded-md border transition-colors ${gradeLevels.includes(level) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'}`}>
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Curricula */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Curricula Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {availableCurricula.map((curriculum) => (
                    <button key={curriculum} type="button" onClick={() => toggleArrayItem(curriculaExpertise, setCurriculaExpertise, curriculum)} className={`px-4 py-2 rounded-md border transition-colors ${curriculaExpertise.includes(curriculum) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'}`}>
                      {curriculum}
                    </button>
                  ))}
                </div>
              </div>

              {/* Teaching Mode */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Teaching Mode</h2>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" name="teaches_online" checked={formData.teaches_online} onChange={handleInputChange} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="ml-2">I offer online sessions</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" name="teaches_in_person" checked={formData.teaches_in_person} onChange={handleInputChange} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="ml-2">I offer in-person sessions</span>
                  </label>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Pricing (QAR per hour)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.teaches_in_person && <Input label="In-Person Hourly Rate" name="hourly_rate_qatari" type="number" min="0" step="0.01" value={formData.hourly_rate_qatari} onChange={handleInputChange} />}
                  {formData.teaches_online && <Input label="Online Hourly Rate" name="hourly_rate_online" type="number" min="0" step="0.01" value={formData.hourly_rate_online} onChange={handleInputChange} />}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" variant="primary" disabled={loading} className="flex-1">
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
