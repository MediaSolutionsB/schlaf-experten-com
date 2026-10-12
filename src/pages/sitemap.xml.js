import { site } from '../site.config.js';
import { allReviews, urlOf } from '../lib/reviews.js';

export async function GET() {
  const pages = [
    '',
    'schlaf-services/',
    'impressum/',
    'datenschutzerklaerung/',
    ...site.categories.filter((c) => allReviews().some((r) => r.category && r.category.slug === c.slug)).map((c) => `kategorie/${c.slug}/`),
    ...[...new Set(allReviews().map((r) => r.type))].map((k) => `${site.types[k].base}/`),
    ...allReviews().map((r) => urlOf(r).replace(/^\//, '')),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${site.url}/${p}</loc>
    <changefreq>${p === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${p === '' ? '1.0' : p.includes('test') || p.includes('bruno') ? '0.9' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
