import { NextApiRequest, NextApiResponse } from 'next';

const PEXELS_API_KEY = 'jzGai41Nhr2xEulLec9pFE8OXvfjwCBaGu3LJSwabBcHNtlHW5p4PsTB';

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
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pexels API error:', response.status, response.statusText, errorText);
      throw new Error(`Pexels API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data.photos || []);
  } catch (error) {
    console.error('Pexels API error:', error);
    res.status(500).json({ error: 'Failed to fetch from Pexels' });
  }
}