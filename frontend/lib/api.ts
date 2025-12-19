import axios from 'axios';

// Use the Next.js API proxy route to avoid CORS issues in development.
// The proxy at /pages/api/proxy/[...path].ts will forward requests to the backend.
// In production, Vercel rewrites handle this directly (see vercel.json).
export const API_BASE_URL = typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
  ? '/api/proxy'
  : '';

export const UPLOADS_BASE_URL = typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
  ? '/api/uploads'
  : '/uploads';

const apiClient = axios.create({
  // If API_BASE_URL is an empty string, let axios use relative URLs.
  baseURL: API_BASE_URL || undefined,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface School {
  id: number;
  name: string;
  type?: string;
  curriculum?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  contact?: string;
  website?: string;
  fee_structure?: any;
  facilities?: string[];
  photos?: string[];
  status?: string;
}

export interface SchoolListResponse {
  total: number;
  page: number;
  page_size: number;
  results: School[];
}

export interface SchoolFilters {
  page?: number;
  page_size?: number;
  curriculum?: string;
  type?: string;
  search?: string;
  location?: string;
  status?: string;
}

// API functions
export const schoolsAPI = {
  /**
   * List schools with optional filters
   */
  async list(filters?: SchoolFilters): Promise<SchoolListResponse> {
    const response = await apiClient.get('/api/schools/', { params: filters });
    return response.data;
  },

  /**
   * Get a single school by ID
   */
  async get(id: number): Promise<School> {
    const response = await apiClient.get(`/api/schools/${id}`);
    return response.data;
  },

  /**
   * Create a new school (admin only)
   */
  async create(school: Partial<School>, token: string): Promise<School> {
    const response = await apiClient.post('/api/schools/', school, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Update a school (admin only)
   */
  async update(
    id: number,
    updates: Partial<School>,
    token: string
  ): Promise<School> {
    const response = await apiClient.put(`/api/schools/${id}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Delete a school (admin only)
   */
  async delete(id: number, token: string): Promise<void> {
    await apiClient.delete(`/api/schools/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Review Types
export interface Review {
  id: number;
  school_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface ReviewCreate {
  school_id: number;
  rating: number;
  comment?: string;
}

// Review API
export const reviewsAPI = {
  /**
   * Submit a review for a school (authenticated)
   */
  async submit(data: ReviewCreate, token: string): Promise<Review> {
    const response = await apiClient.post('/api/reviews/', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Get approved reviews for a school (public)
   */
  async getForSchool(schoolId: number): Promise<Review[]> {
    const response = await apiClient.get(`/api/reviews/school/${schoolId}`);
    return response.data;
  },

  /**
   * Get current user's reviews (authenticated)
   */
  async getMyReviews(token: string): Promise<Review[]> {
    const response = await apiClient.get('/api/reviews/my-reviews', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Get pending reviews for moderation (admin only)
   */
  async getPending(token: string): Promise<Review[]> {
    const response = await apiClient.get('/api/reviews/pending', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Update review status (admin only)
   */
  async updateStatus(reviewId: number, status: string, token: string): Promise<Review> {
    const response = await apiClient.patch(
      `/api/reviews/${reviewId}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};

// Favorite Types
export interface Favorite {
  id: number;
  user_id: number;
  school_id: number;
  created_at: string;
}

export interface FavoriteCreate {
  school_id: number;
}

// Favorite API
export const favoritesAPI = {
  /**
   * Add a school to favorites (authenticated)
   */
  async add(schoolId: number, token: string): Promise<Favorite> {
    const response = await apiClient.post(
      '/api/favorites/',
      { school_id: schoolId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  /**
   * Remove a school from favorites (authenticated)
   */
  async remove(schoolId: number, token: string): Promise<void> {
    await apiClient.delete(`/api/favorites/${schoolId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /**
   * Get user's favorite schools (authenticated)
   */
  async list(token: string): Promise<Favorite[]> {
    const response = await apiClient.get('/api/favorites/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Check if a school is favorited (authenticated)
   */
  async check(schoolId: number, token: string): Promise<boolean> {
    const response = await apiClient.get(`/api/favorites/check/${schoolId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.is_favorited;
  },
};

// Post Types
export interface Post {
  id: number;
  author_id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  published_at?: string;
}

export interface PostListItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  created_at: string;
  published_at?: string;
}

export interface PostListResponse {
  total: number;
  page: number;
  page_size: number;
  results: PostListItem[];
}

export interface PostCreate {
  title: string;
  content: string;
  excerpt?: string;
  status?: string;
}

export interface PostUpdate {
  title?: string;
  content?: string;
  excerpt?: string;
  status?: string;
}

// Post API
export const postsAPI = {
  /**
   * List published blog posts (public)
   */
  async list(page: number = 1, pageSize: number = 10): Promise<PostListResponse> {
    const response = await apiClient.get('/api/posts/', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  /**
   * List all posts including drafts (admin only)
   */
  async listAll(token: string, page: number = 1, pageSize: number = 20): Promise<PostListResponse> {
    const response = await apiClient.get('/api/posts/all', {
      params: { page, page_size: pageSize },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Get a single post by slug (public if published)
   */
  async getBySlug(slug: string): Promise<Post> {
    const response = await apiClient.get(`/api/posts/${slug}`);
    return response.data;
  },

  /**
   * Get a single post by ID (admin only)
   */
  async getById(postId: number, token: string): Promise<Post> {
    const response = await apiClient.get(`/api/posts/id/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Create a new blog post (admin only)
   */
  async create(data: PostCreate, token: string): Promise<Post> {
    const response = await apiClient.post('/api/posts/', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Update a blog post (admin only)
   */
  async update(postId: number, data: PostUpdate, token: string): Promise<Post> {
    const response = await apiClient.put(`/api/posts/${postId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Delete a blog post (admin only)
   */
  async delete(postId: number, token: string): Promise<void> {
    await apiClient.delete(`/api/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Teacher Types
export interface Teacher {
  id: number;
  user_id: number;
  full_name: string;
  bio?: string;
  profile_image?: string;
  years_experience?: number;
  languages?: string[];
  phone?: string;
  email?: string;
  city?: string;
  areas_served?: string[];
  qualifications?: string[];
  specializations?: string[];
  grade_levels?: string[];
  curricula_expertise?: string[];
  teaches_online: boolean;
  teaches_in_person: boolean;
  is_verified: boolean;
  background_check_status: string;
  average_rating: number;
  total_reviews: number;
  total_sessions: number;
  hourly_rate_qatari?: number;
  hourly_rate_online?: number;
  currency: string;
  availability_schedule?: any;
  timezone: string;
  is_active: boolean;
  is_featured: boolean;
  stripe_account_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface TeacherSearchFilters {
  subject?: string;
  grade_level?: string;
  curriculum?: string;
  city?: string;
  teaches_online?: boolean;
  teaches_in_person?: boolean;
  min_rating?: number;
  max_hourly_rate?: number;
  language?: string;
  is_verified?: boolean;
  available_today?: boolean;
}

export interface TeacherListResponse {
  total: number;
  page: number;
  page_size: number;
  results: Teacher[];
}

export interface TeacherCreate {
  full_name: string;
  bio?: string;
  profile_image?: string;
  years_experience?: number;
  languages?: string[];
  phone?: string;
  email?: string;
  city?: string;
  areas_served?: string[];
  qualifications?: string[];
  specializations?: string[];
  grade_levels?: string[];
  curricula_expertise?: string[];
  teaches_online?: boolean;
  teaches_in_person?: boolean;
  hourly_rate_qatari?: number;
  hourly_rate_online?: number;
  availability_schedule?: any;
}

// Teacher API
export const teachersAPI = {
  /**
   * Create a teacher profile
   */
  async create(profile: TeacherCreate, token: string): Promise<Teacher> {
    const response = await apiClient.post('/api/teachers/', profile, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Get current user's teacher profile
   */
  async getMyProfile(token: string): Promise<Teacher> {
    const response = await apiClient.get('/api/teachers/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Update teacher profile
   */
  async updateMyProfile(profile: Partial<TeacherCreate>, token: string): Promise<Teacher> {
    const response = await apiClient.put('/api/teachers/me', profile, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Search teachers with filters
   */
  async search(filters?: TeacherSearchFilters & { page?: number; page_size?: number }): Promise<TeacherListResponse> {
    const response = await apiClient.get('/api/teachers/', { params: filters });
    return response.data;
  },

  /**
   * Get teacher by ID
   */
  async getById(teacherId: number): Promise<Teacher> {
    const response = await apiClient.get(`/api/teachers/${teacherId}`);
    return response.data;
  },

  /**
   * Get teacher availability
   */
  async getAvailability(teacherId: number, date?: string) {
    const response = await apiClient.get(`/api/teachers/${teacherId}/availability`, {
      params: date ? { date } : {},
    });
    return response.data;
  },

  /**
   * Get teacher reviews
   */
  async getReviews(teacherId: number, page?: number, pageSize?: number) {
    const response = await apiClient.get(`/api/teachers/${teacherId}/reviews`, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  /**
   * Admin: list all teachers
   */
  async listAll(token: string): Promise<Teacher[]> {
    const response = await apiClient.get('/api/teachers/all', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Admin: update verification status
   */
  async updateVerification(teacherId: number, isVerified: boolean, backgroundStatus: string | null, token: string): Promise<Teacher> {
    const response = await apiClient.put(`/api/teachers/${teacherId}/verification`, null, {
      params: { is_verified: isVerified, background_check_status: backgroundStatus },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Admin: toggle featured status
   */
  async toggleFeatured(teacherId: number, isFeatured: boolean, token: string): Promise<Teacher> {
    const response = await apiClient.put(`/api/teachers/${teacherId}/featured`, null, {
      params: { is_featured: isFeatured },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async updateStripeAccount(teacherId: number, stripeAccountId: string, token: string): Promise<Teacher> {
    const response = await apiClient.put(`/api/teachers/${teacherId}/stripe-account`, null, {
      params: { stripe_account_id: stripeAccountId },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async requestPayout(teacherId: number, amount: number, currency: string = 'QAR', token: string): Promise<any> {
    const response = await apiClient.post(`/api/teachers/${teacherId}/payouts`, { amount, currency }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async listPayouts(teacherId: number, token: string): Promise<any[]> {
    const response = await apiClient.get(`/api/teachers/${teacherId}/payouts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export interface Booking {
  id: number;
  parent_id: number;
  subject: string;
  grade_level?: string;
  session_type: string;
  duration_hours: number;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  location?: string;
  meeting_link?: string;
  status: string;
  payment_status: string;
  hourly_rate: number;
  total_amount: number;
  commission_amount: number;
  teacher_amount: number;
  special_requests?: string;
  teacher_notes?: string;
  created_at: string;
  confirmed_at?: string;
  completed_at?: string;
  cancelled_at?: string;
}

export interface BookingCreate {
  teacher_id: number;
  subject: string;
  grade_level?: string;
  session_type: string;
  duration_hours?: number;
  scheduled_date: string;
  start_time: string;
  location?: string;
  special_requests?: string;
}

export interface BookingListResponse {
  total: number;
  page: number;
  page_size: number;
  results: Booking[];
}

// Booking API
export const bookingsAPI = {
  /**
   * Create a new booking
   */
  async create(booking: BookingCreate, token: string): Promise<Booking> {
    const response = await apiClient.post('/api/bookings/', booking, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Get user's bookings
   */
  async getMyBookings(token: string, status?: string, page?: number, pageSize?: number): Promise<BookingListResponse> {
    const response = await apiClient.get('/api/bookings/', {
      headers: { Authorization: `Bearer ${token}` },
      params: { status, page, page_size: pageSize },
    });
    return response.data;
  },

  /**
   * Get specific booking
   */
  async getById(bookingId: number, token: string): Promise<Booking> {
    const response = await apiClient.get(`/api/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Update booking
   */
  async update(bookingId: number, updates: Partial<Booking>, token: string): Promise<Booking> {
    const response = await apiClient.put(`/api/bookings/${bookingId}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Cancel booking
   */
  async cancel(bookingId: number, token: string, reason?: string): Promise<void> {
    await apiClient.delete(`/api/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: reason ? { cancellation_reason: reason } : {},
    });
  },

  /**
   * Get teacher's bookings (for teachers)
   */
  async getTeacherBookings(token: string, status?: string): Promise<Booking[]> {
    const response = await apiClient.get('/api/bookings/teacher/', {
      headers: { Authorization: `Bearer ${token}` },
      params: status ? { status } : {},
    });
    return response.data;
  },

  /**
   * Update booking as teacher
   */
  async updateAsTeacher(bookingId: number, updates: { status?: string; teacher_notes?: string }, token: string): Promise<Booking> {
    const response = await apiClient.put(`/api/bookings/teacher/${bookingId}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export default apiClient;
