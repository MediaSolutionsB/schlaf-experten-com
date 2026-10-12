import { site } from '../site.config.js';

export async function GET() {
  const pages = [
    '',
    'schlaf-services/',
    'betten/bruno-boxspringbett/',
    'betten/bruno-schlafsofa/',
    'matratzen/kipli-erfahrungen-test/',
    'betten/impressum/',
    'datenschutzerklaerung/',
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
