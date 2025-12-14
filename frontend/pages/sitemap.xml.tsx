import { GetServerSideProps } from 'next';

const buildUrl = (path: string, base: string) => {
  return `${base.replace(/\/$/, '')}${path}`;
};

export default function Sitemap() {
  // getServerSideProps will handle response
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const siteBase = process.env.NEXT_PUBLIC_BASE_URL;
  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  // Static pages
  const urls = ['/', '/schools', '/blog'];

  // Fetch published schools and posts from backend
  try {
    // fetch schools (attempt large page_size)
    const schoolsResp = await fetch(`${apiBase}/api/schools?page=1&page_size=1000`);
    if (schoolsResp.ok) {
      const data = await schoolsResp.json();
      const results = data.results || [];
      for (const s of results) {
        urls.push(`/schools/${s.id}`);
      }
    }
  } catch (e) {
    // ignore fetch errors and continue with static URLs
    console.error('Failed to fetch schools for sitemap', e);
  }

  try {
    const postsResp = await fetch(`${apiBase}/api/posts?page=1&page_size=1000`);
    if (postsResp.ok) {
      const pdata = await postsResp.json();
      const pres = pdata.results || [];
      for (const p of pres) {
        urls.push(`/blog/${p.slug}`);
      }
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
