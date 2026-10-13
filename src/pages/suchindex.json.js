import { allReviews, urlOf, typeOf } from '../lib/reviews.js';
import { tools } from '../rechner/tools.js';

export async function GET() {
  const reviews = allReviews().map((r) => ({
    title: r.productName || r.title,
    fullTitle: r.title,
    category: (r.category && r.category.name) || 'Schlafen',
    type: typeOf(r).label,
    excerpt: r.excerpt || '',
    url: urlOf(r),
    score: r.score || null,
  }));

  const rechner = tools.map((t) => ({
    title: t.name,
    fullTitle: t.name,
    category: 'Schlaf-Rechner',
    type: 'Rechner',
    excerpt: t.kurz || '',
    url: `/rechner/${t.slug}/`,
    score: null,
  }));

  const services = [
    {
      title: 'Schlafberatung & Vor-Ort-Services',
      fullTitle: 'Schlafberatung & Montage-Services vor Ort',
      category: 'Services',
      type: 'Service',
      excerpt: 'Persönliche Schlafberatung, Bettenmontage, Matratzen-Lieferung und Schadstoff-Check.',
      url: '/schlaf-services/',
      score: null,
    }
  ];

  const suchindex = [...reviews, ...rechner, ...services];

  return new Response(JSON.stringify(suchindex), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
