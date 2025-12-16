import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path = [] } = req.query;
  const pathString = Array.isArray(path) ? path.join('/') : path;

  const target = `${BACKEND}/uploads/${pathString}`;

  try {
    const backendRes = await fetch(target, {
      method: req.method,
      headers: {
        ...(req.headers.authorization && { Authorization: req.headers.authorization }),
      },
    });

    if (!backendRes.ok) {
      return res.status(backendRes.status).json({ error: 'File not found' });
    }

    const contentType = backendRes.headers.get('content-type') || 'application/octet-stream';
    const body = await backendRes.arrayBuffer();

    res.setHeader('Content-Type', contentType);
    res.status(backendRes.status).send(Buffer.from(body));
  } catch (err: any) {
    res.status(502).json({ error: 'Bad gateway', details: err?.message });
  }
}