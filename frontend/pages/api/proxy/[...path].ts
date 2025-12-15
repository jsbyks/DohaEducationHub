import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://dohaeducationhub-production.up.railway.app';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path = [] } = req.query as { path?: string[] };
  const target = `${BACKEND}/api/${Array.isArray(path) ? path.join('/') : path}`;

  try {
    const backendRes = await fetch(target + (req.url?.includes('?') ? '' : ''), {
      method: req.method,
      headers: {
        // Forward selected headers; avoid Host header
        ...(req.headers || {}),
      } as any,
      body: ['GET', 'HEAD'].includes(req.method || '') ? undefined : req.body && JSON.stringify(req.body),
    });

    const body = await backendRes.arrayBuffer();

    res.status(backendRes.status);
    backendRes.headers.forEach((value, key) => {
      // Don't forward hop-by-hop headers that Next.js manages
      if (!['transfer-encoding', 'connection', 'keep-alive'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });
    res.send(Buffer.from(body));
  } catch (err: any) {
    res.status(502).json({ error: 'Bad gateway', details: err?.message });
  }
}
