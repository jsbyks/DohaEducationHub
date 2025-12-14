import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
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

export default apiClient;
