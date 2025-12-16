import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path = [], ...queryParams } = req.query;
  const pathString = Array.isArray(path) ? path.join('/') : path;

  // Build query string from remaining query params
  const queryString = new URLSearchParams(
    Object.entries(queryParams).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        acc[key] = value.join(',');
      } else if (value) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  // Don't add /api/ prefix - it's already in the path from the frontend
  const target = `${BACKEND}/${pathString}${queryString ? `?${queryString}` : ''}`;

  try {
    const backendRes = await fetch(target, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && { Authorization: req.headers.authorization }),
      },
      body: ['GET', 'HEAD'].includes(req.method || '') ? undefined : JSON.stringify(req.body),
    });

    const contentType = backendRes.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      const data = await backendRes.json();
      res.status(backendRes.status).json(data);
    } else {
      const body = await backendRes.arrayBuffer();
      res.status(backendRes.status).send(Buffer.from(body));
    }
  } catch (err: any) {
    res.status(502).json({ error: 'Bad gateway', details: err?.message });
  }
}
