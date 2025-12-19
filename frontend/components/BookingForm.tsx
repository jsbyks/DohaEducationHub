import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import Toast from './Toast';
import { bookingsAPI, BookingCreate, Teacher } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface BookingFormProps {
  teacher: Teacher;
  onSuccess?: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ teacher, onSuccess }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState<BookingCreate>({
    teacher_id: teacher.id,
    subject: '',
    grade_level: '',
    session_type: teacher.teaches_online ? 'online' : 'in_person',
    duration_hours: 1,
    scheduled_date: '',
    start_time: '',
    location: '',
    special_requests: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setToast({ message: 'Please log in to book a session', type: 'error' });
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      console.log('Sending booking data:', formData);
      await bookingsAPI.create(formData, token);

      setToast({ message: 'Booking request submitted successfully!', type: 'success' });

      // Reset form
      setFormData({
        ...formData,
        subject: '',
        grade_level: '',
        scheduled_date: '',
        start_time: '',
        location: '',
        special_requests: '',
      });

      if (onSuccess) {
        onSuccess();
      }

      // Redirect to bookings page after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/bookings');
      }, 2000);
    } catch (err: any) {
      console.error('Failed to create booking:', err);
      setToast({
        message: err.response?.data?.detail || err.message || 'Failed to create booking',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof BookingCreate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const clearToast = () => setToast(null);

  // Calculate price
  const hourlyRate = formData.session_type === 'online'
    ? teacher.hourly_rate_online
    : teacher.hourly_rate_qatari;
  const totalAmount = hourlyRate ? hourlyRate * formData.duration_hours : 0;

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const sessionTypeOptions = [];
  if (teacher.teaches_online) {
    sessionTypeOptions.push({ value: 'online', label: `Online (${teacher.hourly_rate_online} QAR/hr)` });
  }
  if (teacher.teaches_in_person) {
    sessionTypeOptions.push({ value: 'in_person', label: `In-Person (${teacher.hourly_rate_qatari} QAR/hr)` });
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            options={[
              { value: '', label: 'Select a subject' },
              ...(teacher.specializations || []).map(spec => ({ value: spec, label: spec })),
            ]}
            required
          />
        </div>

        {/* Grade Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grade Level
          </label>
          <Input
            value={formData.grade_level}
            onChange={(e) => handleChange('grade_level', e.target.value)}
            placeholder="e.g., Grade 5, Year 10, IB1"
          />
        </div>

        {/* Session Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Type <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.session_type}
            onChange={(e) => handleChange('session_type', e.target.value)}
            options={sessionTypeOptions}
            required
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (hours) <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.duration_hours.toString()}
            onChange={(e) => handleChange('duration_hours', parseFloat(e.target.value))}
            options={[
              { value: '0.5', label: '30 minutes' },
              { value: '1', label: '1 hour' },
              { value: '1.5', label: '1.5 hours' },
              { value: '2', label: '2 hours' },
              { value: '2.5', label: '2.5 hours' },
              { value: '3', label: '3 hours' },
            ]}
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Date <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            value={formData.scheduled_date}
            onChange={(e) => handleChange('scheduled_date', e.target.value)}
            min={minDate}
            required
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Start Time <span className="text-red-500">*</span>
          </label>
          <Input
            type="time"
            value={formData.start_time}
            onChange={(e) => handleChange('start_time', e.target.value)}
            required
          />
        </div>

        {/* Location (for in-person) */}
        {formData.session_type === 'in_person' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Location
            </label>
            <Input
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g., Your home address or preferred meeting location"
            />
          </div>
        )}

        {/* Special Requests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Requests or Notes
          </label>
          <textarea
            value={formData.special_requests}
            onChange={(e) => handleChange('special_requests', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Any specific topics or requirements?"
          />
        </div>

        {/* Price Summary */}
        {hourlyRate && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Hourly Rate:</span>
              <span className="font-medium">{hourlyRate} QAR/hr</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Duration:</span>
              <span className="font-medium">{formData.duration_hours} {formData.duration_hours === 1 ? 'hour' : 'hours'}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-300">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-xl font-bold text-primary-600">{totalAmount.toFixed(2)} QAR</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" disabled={loading} className="w-full" size="lg">
          {loading ? 'Submitting...' : 'Request Booking'}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Your booking request will be sent to the teacher for confirmation.
          You will be notified once the teacher responds.
        </p>
      </form>
    </div>
  );
};
