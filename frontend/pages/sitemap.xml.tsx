import { GetServerSideProps } from 'next';

const buildUrl = (path: string, base: string) => {
  return `${base.replace(/\/$/, '')}${path}`;
};

export default function Sitemap() {
  // getServerSideProps will handle response
  return null;
}

// Try multiple candidate bases for the API so builds don't fail when
// NEXT_PUBLIC_API_URL is not set. The order is: explicit API env, site base,
// then localhost (development fallback).
const candidateApiBases = () => {
  const list: string[] = [];
  if (process.env.NEXT_PUBLIC_API_URL) list.push(process.env.NEXT_PUBLIC_API_URL);
  if (process.env.NEXT_PUBLIC_BASE_URL) list.push(process.env.NEXT_PUBLIC_BASE_URL);
  // Keep localhost only as the last-resort development fallback
  if (process.env.NODE_ENV !== 'production') list.push('http://localhost:8000');
  return list;
};

async function fetchJsonFromCandidates(path: string) {
  const candidates = candidateApiBases();
  for (const base of candidates) {
    try {
      const url = `${base.replace(/\/$/, '')}${path}`;
      const resp = await fetch(url);
      if (resp.ok) return resp.json();
    } catch (e) {
      // try next candidate
      console.warn(`sitemap: fetch failed for ${base}${path}`, e);
    }
  }
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const siteBase = process.env.NEXT_PUBLIC_BASE_URL || '';

  if (!siteBase) {
    // It's helpful to know at build time when the base URL is not provided
    // so the sitemap will contain relative urls.
    console.warn('NEXT_PUBLIC_BASE_URL is not set; sitemap will use relative URLs');
  }

  // Static pages
  const urls = ['/', '/schools', '/blog'];

  // Fetch published schools and posts from backend (try multiple bases)
  try {
    const data = await fetchJsonFromCandidates('/api/schools?page=1&page_size=1000');
    const results = (data && data.results) || [];
    for (const s of results) {
      urls.push(`/schools/${s.id}`);
    }
  } catch (e) {
    console.error('Failed to fetch schools for sitemap', e);
  }

  try {
    const pdata = await fetchJsonFromCandidates('/api/posts?page=1&page_size=1000');
    const pres = (pdata && pdata.results) || [];
    for (const p of pres) {
      urls.push(`/blog/${p.slug}`);
    }
  } catch (e) {
    console.error('Failed to fetch posts for sitemap', e);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u => `  <url>\n    <loc>${buildUrl(u, siteBase)}</loc>\n  </url>`).join('\n') +
    `\n</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.write(xml);
  res.end();

  return { props: {} };
};
