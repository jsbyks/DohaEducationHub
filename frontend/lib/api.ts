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

export default apiClient;
