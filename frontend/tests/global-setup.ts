import { FullConfig } from '@playwright/test';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default async function globalSetup(config: FullConfig) {
  console.log('Starting Playwright global setup...');

  // Seed a test admin user first
  try {
    const adminResponse = await axios.post(`${API_URL}/api/auth/register`, {
      email: 'admin@test.com',
      password: 'admin123',
      full_name: 'Test Admin',
      is_admin: true
    });
    console.log('Test admin user created:', adminResponse.data);
  } catch (e: any) {
    if (e.response && e.response.status === 409) {
      console.log('Test admin user already exists');
    } else {
      console.error('Failed to create test admin:', e.message);
    }
  }

  // Login to get admin token
  let adminToken = '';
  try {
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'admin@test.com',
      password: 'admin123'
    });
    adminToken = loginResponse.data.access_token;
    console.log('Admin token obtained');
  } catch (e: any) {
    console.error('Failed to login as admin:', e.message);
  }

  // Seed a test school
  try {
    await axios.post(`${API_URL}/api/schools/`, {
      name: 'International Test School',
      curriculum: 'British',
      type: 'Primary',
      address: '123 Test St, Doha',
      latitude: 25.2854,
      longitude: 51.5310,
      contact: '+974 1234 5678',
      website: 'https://testschool.qa',
      fee_structure: { grade1: 10000, grade2: 12000 },
      facilities: ['Library', 'Sports', 'Science Lab'],
      status: 'published',
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('Test school seeded successfully');
  } catch (e: any) {
    if (e.response && e.response.status === 409) {
      console.log('Test school already exists');
    } else {
      console.error('Failed to seed school:', e.message);
    }
  }

  console.log('Playwright global setup completed');
}