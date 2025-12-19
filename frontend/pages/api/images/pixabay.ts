import { NextApiRequest, NextApiResponse } from 'next';

const PIXABAY_API_KEY = '34290303-2de9d7303dd55bff8b1e916ac';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, perPage = '15' } = req.query;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&per_page=${perPage}&image_type=photo&orientation=horizontal`
    );

    if (!response.ok) {
      throw new Error('Pixabay API request failed');
    }

    const data = await response.json();
    res.status(200).json(data.hits || []);
  } catch (error) {
    console.error('Pixabay API error:', error);
    res.status(500).json({ error: 'Failed to fetch from Pixabay' });
  }
}