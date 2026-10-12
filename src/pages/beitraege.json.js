// Liste aller veröffentlichten Beiträge für das YT-Tool (interne Verlinkung "Auch interessant").
import { allReviews, urlOf } from '../lib/reviews.js';

export function GET() {
  const liste = allReviews().map((r) => ({
    slug: r.slug,
    url: urlOf(r),
    type: r.type,
    productName: r.productName || r.title,
    category: (r.category && r.category.slug) || r.category || '',
    brand: r.brand || '',
    excerpt: (r.excerpt || '').slice(0, 200),
  }));
  return new Response(JSON.stringify(liste), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
