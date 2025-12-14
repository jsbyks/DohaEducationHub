import Head from 'next/head';

type SEOProps = {
  title?: string;
  description?: string;
  path?: string; // path relative to site root
  image?: string;
  type?: string;
  publishedAt?: string;
  modifiedAt?: string;
  schema?: object; // additional/custom JSON-LD to merge
};

const siteBase = process.env.NEXT_PUBLIC_BASE_URL || 'https://doha-education-hub.vercel.app';

export function SEO({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  publishedAt,
  modifiedAt,
  schema,
}: SEOProps) {
  // Ensure siteBase is always a string
  const baseUrl = typeof siteBase === 'string' ? siteBase : 'https://doha-education-hub.vercel.app';
  const fullUrl = `${baseUrl.replace(/\/$/, '')}${path}`;
  const metaTitle = title ? `${title} | Doha Education Hub` : 'Doha Education Hub';
  const metaDescription = description || 'Find and review schools in Doha.';
  const metaImage = image || `${baseUrl.replace(/\/$/, '')}/og-image.png`;

  const baseJsonLd: any = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'BlogPosting' : 'WebSite',
    url: fullUrl,
    name: title || 'Doha Education Hub',
    description: metaDescription,
  };
  if (publishedAt) baseJsonLd.datePublished = publishedAt;
  if (modifiedAt) baseJsonLd.dateModified = modifiedAt;

  const jsonLd = schema ? { ...baseJsonLd, ...schema } : baseJsonLd;

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
}

export default SEO;
