import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { teachersAPI } from '../../lib/api';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export default function CreateTeacherProfile() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    bio: '',
    years_experience: '',
    phone: '',
    email: user?.email || '',
    city: 'Doha',
    hourly_rate_qatari: '',
    hourly_rate_online: '',
    teaches_online: true,
    teaches_in_person: true,
  });

  // Multi-select state
  const [languages, setLanguages] = useState<string[]>([]);
  const [areasServed, setAreasServed] = useState<string[]>([]);
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [gradeLevels, setGradeLevels] = useState<string[]>([]);
  const [curriculaExpertise, setCurriculaExpertise] = useState<string[]>([]);

  // Temporary input fields for adding items
  const [newLanguage, setNewLanguage] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newQualification, setNewQualification] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');

  const availableGradeLevels = ['KG', 'Primary', 'Secondary', 'High School'];
  const availableCurricula = ['British', 'American', 'IB', 'Arabic', 'Indian'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addToArray = (array: string[], setArray: (arr: string[]) => void, value: string, setValue: (val: string) => void) => {
    if (value.trim() && !array.includes(value.trim())) {
      setArray([...array, value.trim()]);
      setValue('');
    }
  };

  const removeFromArray = (array: string[], setArray: (arr: string[]) => void, value: string) => {
    setArray(array.filter(item => item !== value));
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

    // Validation
    if (!formData.full_name.trim()) {
      setError('Full name is required');
      return;
    }

    if (specializations.length === 0) {
      setError('Please add at least one subject specialization');
      return;
    }

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

      await teachersAPI.create(profileData, token);
      router.push('/teacher/dashboard');
    } catch (err: any) {
      console.error('Failed to create teacher profile:', err);
      if (err.response?.status === 400 && err.response?.data?.detail?.includes('already has a teacher profile')) {
        setError('You already have a teacher profile. Redirecting...');
        setTimeout(() => router.push('/teacher/dashboard'), 2000);
      } else {
        setError(err.response?.data?.detail || 'Failed to create profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/dashboard" className="text-primary-600 hover:text-primary-800">
              ← Back to Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Become a Teacher</h1>
              <p className="text-gray-600">Create your teacher profile to start offering tutoring services</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+974-XXXX-XXXX"
                  />
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Doha"
                  />
                  <Input
                    label="Years of Experience"
                    name="years_experience"
                    type="number"
                    min="0"
                    value={formData.years_experience}
                    onChange={handleInputChange}
                    placeholder="5"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Tell students about yourself, your teaching experience, and approach..."
                  />
                </div>
              </div>

              {/* Languages */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Languages</h2>
                <div className="flex gap-2 mb-2">
                  <Input
                    label=""
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="e.g., English, Arabic"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray(languages, setLanguages, newLanguage, setNewLanguage);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => addToArray(languages, setLanguages, newLanguage, setNewLanguage)}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <span key={lang} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm flex items-center gap-2">
                      {lang}
                      <button type="button" onClick={() => removeFromArray(languages, setLanguages, lang)} className="text-primary-600 hover:text-primary-800">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Areas Served */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Areas Served (for in-person tutoring)</h2>
                <div className="flex gap-2 mb-2">
                  <Input
                    label=""
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    placeholder="e.g., West Bay, The Pearl"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray(areasServed, setAreasServed, newArea, setNewArea);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => addToArray(areasServed, setAreasServed, newArea, setNewArea)}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {areasServed.map((area) => (
                    <span key={area} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-2">
                      {area}
                      <button type="button" onClick={() => removeFromArray(areasServed, setAreasServed, area)} className="text-gray-600 hover:text-gray-800">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Qualifications */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Qualifications</h2>
                <div className="flex gap-2 mb-2">
                  <Input
                    label=""
                    value={newQualification}
                    onChange={(e) => setNewQualification(e.target.value)}
                    placeholder="e.g., Bachelor in Education, TEFL Certified"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray(qualifications, setQualifications, newQualification, setNewQualification);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => addToArray(qualifications, setQualifications, newQualification, setNewQualification)}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {qualifications.map((qual) => (
                    <span key={qual} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-2">
                      {qual}
                      <button type="button" onClick={() => removeFromArray(qualifications, setQualifications, qual)} className="text-gray-600 hover:text-gray-800">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Specializations */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Subject Specializations *</h2>
                <div className="flex gap-2 mb-2">
                  <Input
                    label=""
                    value={newSpecialization}
                    onChange={(e) => setNewSpecialization(e.target.value)}
                    placeholder="e.g., Mathematics, English, Science"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray(specializations, setSpecializations, newSpecialization, setNewSpecialization);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => addToArray(specializations, setSpecializations, newSpecialization, setNewSpecialization)}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((spec) => (
                    <span key={spec} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm flex items-center gap-2">
                      {spec}
                      <button type="button" onClick={() => removeFromArray(specializations, setSpecializations, spec)} className="text-primary-600 hover:text-primary-800">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Grade Levels */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Grade Levels</h2>
                <div className="flex flex-wrap gap-2">
                  {availableGradeLevels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => toggleArrayItem(gradeLevels, setGradeLevels, level)}
                      className={`px-4 py-2 rounded-md border transition-colors ${
                        gradeLevels.includes(level)
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
                      }`}
                    >
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
                    <button
                      key={curriculum}
                      type="button"
                      onClick={() => toggleArrayItem(curriculaExpertise, setCurriculaExpertise, curriculum)}
                      className={`px-4 py-2 rounded-md border transition-colors ${
                        curriculaExpertise.includes(curriculum)
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
                      }`}
                    >
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
                    <input
                      type="checkbox"
                      name="teaches_online"
                      checked={formData.teaches_online}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2">I offer online sessions</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="teaches_in_person"
                      checked={formData.teaches_in_person}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2">I offer in-person sessions</span>
                  </label>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Pricing (QAR per hour)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.teaches_in_person && (
                    <Input
                      label="In-Person Hourly Rate"
                      name="hourly_rate_qatari"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.hourly_rate_qatari}
                      onChange={handleInputChange}
                      placeholder="200"
                    />
                  )}
                  {formData.teaches_online && (
                    <Input
                      label="Online Hourly Rate"
                      name="hourly_rate_online"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.hourly_rate_online}
                      onChange={handleInputChange}
                      placeholder="150"
                    />
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Creating Profile...' : 'Create Teacher Profile'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
