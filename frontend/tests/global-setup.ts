import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default async function globalSetup() {
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
      headers: { Authorization: `Bearer ${process.env.TEST_ADMIN_TOKEN || ''}` }
    });
  } catch (e: any) {
    if (e.response && e.response.status !== 409) {
      // 409 = already exists, ignore
      console.error('Failed to seed school:', e.message);
    }
  }

  // Optionally, seed a test user via API if needed
  // (Or rely on registration test)
}
