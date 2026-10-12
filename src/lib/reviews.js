import fs from 'node:fs';
import path from 'node:path';
import { site } from '../site.config.js';

const root = path.resolve('content/reviews');

const ICON_PRO = '<span class="se-ico se-ico-pro" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg></span>';
const ICON_CON = '<span class="se-ico se-ico-con" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"><path d="M6 12h12"/></svg></span>';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const stripTags = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const validAsin = (a) => /^[A-Z0-9]{10}$/.test(a || '');

export function typeOf(review) {
  return site.types[review.type] || site.types.test;
}

// Alte Beiträge (aus WordPress übernommen) behalten ihre bisherige Adresse direkt hinter der Domain.
export function urlOf(review) {
  return review.path || `/${typeOf(review).base}/${review.slug}/`;
}

// Kauf-Link immer aus Produktnummer + Partner-Tag der Seite, nie aus dem Video.
export function buyLink(meta) {
  if (validAsin(meta.asin)) return `https://www.amazon.de/dp/${meta.asin}${site.amazonTag ? `?tag=${site.amazonTag}` : ''}`;
  // Produkt gibt es nicht bei Amazon: eigener Kauflink (z. B. Partnerlink zu einem anderen Shop)
  if (typeof meta.kaufLink === 'string' && /^https:\/\/[^\s<>"']+$/.test(meta.kaufLink)) return meta.kaufLink;
  return '';
}

// Name des Shops für den Kaufknopf
export function shopOf(meta) {
  if (validAsin(meta.asin)) return 'Amazon';
  return (meta.shop || '').trim() || 'beim Händler';
}

export function buyLabel(meta) {
  const shop = shopOf(meta);
  return shop === 'beim Händler' ? 'Aktuellen Preis beim Händler prüfen' : `Aktuellen Preis bei ${shop} prüfen`;
}

function scoreBlock(score) {
  const s = Math.max(0, Math.min(100, Number(score)));
  return `<div class="se-score" role="img" aria-label="${s} von 100 Punkten"><div class="se-score-num"><strong>${s}</strong><span>/100</span></div><div class="se-score-bar"><span style="width:${s}%"></span></div></div>`;
}

function buyBlock(inner, meta) {
  const title = stripTags((inner.match(/<strong>([\s\S]*?)<\/strong>/i) || [, 'Hier gibt es das Produkt zu kaufen:'])[1]);
  const link = buyLink(meta);
  if (!link) return '';
  const img = meta.imageSmall || meta.image;
  const picture = img ? `<a class="se-buy-img" href="${esc(link)}" target="_blank" rel="nofollow sponsored noopener" tabindex="-1" aria-hidden="true"><img src="${esc(img)}" alt="" width="640" height="360" loading="lazy" /></a>` : '';
  const button = `<a class="se-btn" href="${esc(link)}" target="_blank" rel="nofollow sponsored noopener">${esc(buyLabel(meta))}<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg></a>`;
  const note = '<span class="se-buy-note">Partnerlink: Kaufst du darüber ein, erhalten wir eine kleine Provision.</span>';
  return `<div class="se-buy"><div class="se-buy-text"><strong>${esc(title)}</strong><span>${esc(meta.productName || '')}</span></div><div class="se-buy-action">${picture}${button}${note}</div></div>`;
}

// Der Kauf-Kasten soll dreimal vorkommen: an der Stelle aus dem Text, in der Mitte und ganz am Ende.
function ensureThreeBuyBoxes(raw, meta) {
  if (!buyLink(meta)) return raw;
  const re = /\[colorframe\][\s\S]*?\[\/colorframe\]/gi;
  const found = raw.match(re) || [];
  if (found.length === 0 || found.length >= 3) return raw;
  const box = `\n\n${found[0]}\n\n`;
  let out = raw;
  let count = found.length;
  // 1. ganz am Ende, falls dort noch keiner steht
  const lastEnd = out.lastIndexOf('[/colorframe]') + '[/colorframe]'.length;
  if (/<h2/i.test(out.slice(lastEnd))) {
    out = out.replace(/\s*$/, '') + box;
    count += 1;
  }
  // 2. in der Mitte: vor dem Fazit, sonst vor der mittleren Zwischenüberschrift
  if (count < 3) {
    const firstEnd = out.indexOf('[/colorframe]') + '[/colorframe]'.length;
    const heads = [...out.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].filter((m) => m.index > firstEnd);
    const usable = heads.filter((m) => !/^\s*\[colorframe\]/i.test(out.slice(m.index + m[0].length)) && !/\[\/colorframe\]\s*$/i.test(out.slice(0, m.index)));
    const pick = usable.find((m) => /Fazit/i.test(m[1])) || usable[Math.floor(usable.length / 2)];
    if (pick && usable.indexOf(pick) > 0) out = out.slice(0, pick.index) + box.trimStart() + out.slice(pick.index);
  }
  return out;
}

function tableBlock(tableHtml) {
  const isRating = /\d+\s*\/\s*20\s*Punkte/.test(tableHtml);
  let t = tableHtml.replace(/<table[^>]*>/i, '<table>');
  if (isRating) {
    t = t.replace(/<td>\s*(\d+)\s*\/\s*20\s*Punkte\s*<\/td>/g, (m, p) => {
      const pct = Math.max(0, Math.min(20, Number(p))) * 5;
      return `<td class="se-pts"><strong>${p}/20 Punkte</strong><span class="se-pts-bar"><span style="width:${pct}%"></span></span></td>`;
    });
  }
  return `<div class="se-table${isRating ? ' se-table-rating' : ' se-table-facts'}">${t}</div>`;
}

const unescapeHtml = (t) => t.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&amp;/g, '&');

function figureBlock(inner) {
  const src = (inner.match(/<img[^>]*src=["']([^"']+)["']/i) || [])[1];
  if (!src) return '';
  const cap = unescapeHtml(stripTags((inner.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i) || [, ''])[1]));
  return `<figure class="se-shot"><img src="${esc(src)}" alt="${esc(cap)}" width="1280" height="720" loading="lazy" />${cap ? `<figcaption>${esc(cap)}</figcaption>` : ''}</figure>`;
}

// ----- Alte Beiträge aus WordPress -----
// AAWP-Kästen mit veralteten Preisen werden durch den Kauf-Kasten ersetzt (Preis nur bei Amazon),
// YouTube-Videos laden erst nach Klick (Datenschutz), WordPress-Kürzel verschwinden.
function legacyBuyBox(asin, title, img) {
  const link = `https://www.amazon.de/dp/${asin}${site.amazonTag ? `?tag=${site.amazonTag}` : ''}`;
  const picture = img ? `<a class="se-buy-img" href="${esc(link)}" target="_blank" rel="nofollow sponsored noopener" tabindex="-1" aria-hidden="true"><img src="${esc(img)}" alt="" loading="lazy" /></a>` : '';
  return `<div class="se-buy se-buy-legacy"><div class="se-buy-text"><strong>Hier gibt es das Produkt zu kaufen:</strong><span>${esc(title)}</span></div><div class="se-buy-action">${picture}<a class="se-btn se-btn-buy" href="${esc(link)}" target="_blank" rel="nofollow sponsored noopener">Aktuellen Preis bei Amazon prüfen</a><span class="se-buy-note">Partnerlink: Kaufst du darüber ein, erhalten wir eine kleine Provision.</span></div></div>`;
}

export function renderLegacy(raw, meta) {
  let html = raw.replace(/\r\n/g, '\n').replace(/<script[\s\S]*?<\/script>/gi, '');
  // AAWP-Produktkästen: vom Kasten-Anfang bis zum Ende seines Footers
  html = html.replace(/<div class="aawp">[\s\S]*?<div class="aawp-product[^"]*"[^>]*data-aawp-product-asin="([A-Z0-9]{10})"[^>]*data-aawp-product-title="([^"]*)"[\s\S]*?<img[^>]*class="aawp-product__image"[^>]*src="([^"]+)"[\s\S]*?<\/a>\s*<\/div>\s*<\/div>\s*<\/div>/g,
    (m, asin, title, img) => legacyBuyBox(asin, unescapeHtml(title), img));
  // YouTube-Einbettungen -> Vorschaubild mit Klick zum Laden
  html = html.replace(/<div class="su-youtube[^"]*">\s*(<iframe[\s\S]*?<\/iframe>)\s*<\/div>/gi, '$1');
  html = html.replace(/<div[^>]*>\s*(<iframe[^>]*youtube[\s\S]*?<\/iframe>)\s*<\/div>/gi, '$1');
  html = html.replace(/<iframe[^>]*src="https:\/\/www\.youtube(?:-nocookie)?\.com\/embed\/([\w-]{11})[^"]*"[^>]*>\s*<\/iframe>/gi,
    (m, id) => `<div class="se-video se-video-inline" data-video="${id}" data-title="Video"><button class="se-video-play" type="button" aria-label="Video abspielen"><span>Video ansehen</span></button></div><p class="se-video-hint">Beim Abspielen wird das Video von YouTube geladen.</p>`);
  html = html.replace(/\[\/?(su_[a-z_]+|caption|embed)[^\]]*\]/gi, '');
  // Hüllen um den Kauf-Kasten entfernen und WordPress-Inline-Stile (Unterstreichungen, Farben) weglassen
  html = html.replace(/<div class="su-note"[^>]*>\s*<div class="su-note-inner[^>]*>\s*(<div class="se-buy se-buy-legacy">[\s\S]*?<\/span><\/div><\/div>)\s*<\/div>\s*<\/div>/g, '$1');
  html = html.replace(/\s(style|data-mce-[a-z-]+)="[^"]*"/gi, '');
  html = html.replace(/<p>(?:\s|&nbsp;)*<\/p>/g, '');
  // Höchstens drei Kauf-Kästen: der erste, einer in der Mitte und der letzte
  const boxen = [...html.matchAll(/<div class="se-buy se-buy-legacy">[\s\S]*?<\/span><\/div><\/div>/g)];
  if (boxen.length > 3) {
    const behalten = new Set([0, Math.floor(boxen.length / 2), boxen.length - 1]);
    for (let i = boxen.length - 1; i >= 0; i--) {
      if (!behalten.has(i)) html = html.slice(0, boxen[i].index) + html.slice(boxen[i].index + boxen[i][0].length);
    }
  }
  return html;
}

// Wandelt den Pipeline-Artikel (HTML mit den bisherigen Kuerzeln) in die Bausteine der Seite um.
export function renderArticle(raw, meta) {
  let html = raw.replace(/\r\n/g, '\n');
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  html = ensureThreeBuyBoxes(html, meta);
  const blocks = [];
  const hold = (b) => `\n\n%%EM${blocks.push(b) - 1}%%\n\n`;

  html = html.replace(/\[colorframe\]([\s\S]*?)\[\/colorframe\]/gi, (m, inner) => hold(buyBlock(inner, meta)));
  html = html.replace(/\[su_table[^\]]*\]\s*([\s\S]*?)\s*\[\/su_table\]/gi, (m, inner) => hold(tableBlock(inner)));
  html = html.replace(/<table[\s\S]*?<\/table>/gi, (m) => hold(tableBlock(m)));
  html = html.replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, (m, inner) => hold(figureBlock(inner)));
  html = html.replace(/\[bewertungsskala\s+score=["']?(\d+)["']?\s*\]/gi, (m, s) => hold(scoreBlock(s)));
  html = html.replace(/<p>\s*🟢\s*([\s\S]*?)<\/p>/g, (m, inner) => hold(`<p class="se-pro">${ICON_PRO}<span>${inner.trim()}</span></p>`));
  html = html.replace(/<p>\s*🔴\s*([\s\S]*?)<\/p>/g, (m, inner) => hold(`<p class="se-con">${ICON_CON}<span>${inner.trim()}</span></p>`));
  html = html.replace(/<(ul|ol)[^>]*>([\s\S]*?)<\/\1>/gi, (m, tag, inner) => hold(`<${tag}>${inner.trim()}</${tag}>`));
  html = html.replace(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi, (m, n, inner) => hold(`<h${n}>${inner.trim()}</h${n}>`));
  html = html.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (m, inner) => `\n\n${inner.trim()}\n\n`);
  html = html.replace(/\[\/?[a-z_]+[^\]]*\]/gi, '');

  const out = html
    .split(/\n{2,}/)
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => {
      if (/^%%EM\d+%%$/.test(c)) return c;
      const text = c.replace(/\n/g, ' ');
      if (/^Hinweis:/i.test(text)) return `<p class="se-note">${text}</p>`;
      if (/^<strong>[^<]*Gesamtbewertung[^<]*<\/strong>$/i.test(text)) return `<p class="se-score-label">${text}</p>`;
      return `<p>${text}</p>`;
    })
    .join('\n');
  return out.replace(/%%EM(\d+)%%/g, (m, i) => blocks[Number(i)]);
}

function extract(raw) {
  const score = Number((raw.match(/\[bewertungsskala\s+score=["']?(\d+)/i) || [, 0])[1]);
  const pick = (emoji) => [...raw.matchAll(new RegExp(`<p>\\s*${emoji}\\s*<strong>([\\s\\S]*?)</strong>\\s*([\\s\\S]*?)</p>`, 'g'))].map((m) => stripTags(`${m[1]} ${m[2]}`));
  const ratings = [...raw.matchAll(/<tr>\s*<td>([\s\S]*?)<\/td>\s*<td>\s*(\d+)\s*\/\s*20\s*Punkte\s*<\/td>/g)].map((m) => ({ name: stripTags(m[1]), points: Number(m[2]) }));
  return { score, pros: pick('🟢'), cons: pick('🔴'), ratings };
}

export function allReviews() {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root)
    .filter((d) => fs.existsSync(path.join(root, d, 'meta.json')))
    .map((d) => {
      const meta = JSON.parse(fs.readFileSync(path.join(root, d, 'meta.json'), 'utf-8'));
      const raw = fs.readFileSync(path.join(root, d, 'article.html'), 'utf-8');
      const data = extract(raw);
      const sum = data.ratings.reduce((a, r) => a + r.points, 0);
      if (data.ratings.length && sum !== data.score) {
        throw new Error(`Bewertung passt nicht: ${meta.slug} hat Gesamt ${data.score}, Summe der Kategorien ist ${sum}`);
      }
      return { type: 'test', ...meta, ...data, raw, category: site.categories.find((c) => c.slug === meta.category) || null };
    })
    // Geplante Beiträge (Datum in der Zukunft) erscheinen erst zu ihrer Zeit (publishAt) bzw. an ihrem Tag.
    .filter((r) => (r.publishAt || `${r.published}T00:00`) <= now())
    .sort((a, b) => (a.published < b.published ? 1 : -1));
}

// Jetzt in deutscher Zeit, z.B. 2026-10-11T14:05
export function now() {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin', dateStyle: 'short', timeStyle: 'short' }).format(new Date()).replace(' ', 'T');
}

// Heutiges Datum in deutscher Zeit, z.B. 2026-10-11
export function today() {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(new Date());
}

export function formatDate(iso) {
  return new Date(iso + 'T12:00:00Z').toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

// ----------------- Interne Verlinkung -----------------
// Produktgruppen: Beiträge derselben Gruppe sind die besten Kandidaten für "Passende Tests und Checks".
const GRUPPEN = [
  ['matratze', /matratze|kaltschaum|federkern|latex/i],
  ['bett', /boxspring|bett(?!w)|bettgestell|lattenrost/i],
  ['schlafsofa', /schlafsofa|schlafcouch|gästebett/i],
  ['kissen', /kissen|topper|decke|bettwäsche|bettwaesche/i],
];
// Kern des Produktnamens ohne Marke und Gattung, damit dasselbe Produkt nicht doppelt auftaucht.
const kern = (r) => (r.productName || r.slug).toLowerCase().replace(new RegExp(`\\b(${brandOf(r)})\\b`, 'g'), '').replace(/[^a-z0-9äöü]/g, '');
// Verwandte Gruppen: z. B. passt zu einem Rasenmäher auch ein Mähroboter.
const VERWANDT = { matratze: 'bett', bett: 'matratze', kissen: 'matratze', schlafsofa: 'bett' };
const gruppeOf = (r) => (GRUPPEN.find(([, re]) => re.test(`${r.slug} ${r.productName || ''}`)) || [null])[0];
const brandOf = (r) => (r.brand || (r.productName || '').split(' ')[0] || '').toLowerCase().replace(/[^a-zäöü]/g, '');
const catOf = (r) => (r.category && typeof r.category === 'object' ? r.category.slug : r.category) || '';

/** 3–4 passende Beiträge: erst gleiche Produktgruppe, dann gleiche Kategorie, dann gleiche Marke. */
export function relatedReviews(review, all, max = 4) {
  const g = gruppeOf(review);
  const b = brandOf(review);
  const c = catOf(review);
  const schonImText = new Set([...(review.auchInteressant || []).join(' ').matchAll(/\[\[([a-z0-9-]+)\]\]/g)].map((m) => m[1]));
  return all
    .filter((r) => r.slug !== review.slug && (r.productName || '') !== (review.productName || '-'))
    .map((r) => ({
      r,
      score: (g && gruppeOf(r) === g ? 50 : 0) + (VERWANDT[g] && VERWANDT[g] === gruppeOf(r) ? 25 : 0) + (c && catOf(r) === c ? 20 : 0) + (b && brandOf(r) === b ? 10 : 0) - (schonImText.has(r.slug) ? 5 : 0),
    }))
    .filter((x) => x.score >= 20)
    .sort((a, b2) => b2.score - a.score || (a.r.published < b2.r.published ? 1 : -1))
    .filter((x, i, arr) => arr.findIndex((y) => kern(y.r) === kern(x.r)) === i && kern(x.r) !== kern(review))
    .slice(0, max)
    .map((x) => x.r);
}

/** "Auch interessant"-Absatz: [[slug]] wird zum Link mit dem Produktnamen. Sätze mit gelöschtem Ziel fallen weg. */
export function alsoBlock(review, all) {
  const bySlug = new Map(all.map((r) => [r.slug, r]));
  const parts = (review.auchInteressant || [])
    .map((satz) => {
      let ok = true;
      const html = esc(satz).replace(/\[\[([a-z0-9-]+)\]\]/g, (m, slug) => {
        const t = bySlug.get(slug);
        if (!t || slug === review.slug) { ok = false; return ''; }
        return `<a href="${urlOf(t)}">${esc(t.productName || t.title)}</a>`;
      });
      return ok ? html : null;
    })
    .filter(Boolean);
  if (!parts.length) return '';
  return `<aside class="se-also"><span class="se-also-label">Auch interessant</span><p>${parts.join(' ')}</p></aside>`;
}

/** Fügt den Absatz vor der Fazit-Überschrift ein (sonst vor der letzten Überschrift). */
export function insertBeforeFazit(html, block) {
  if (!block) return html;
  const heads = [...html.matchAll(/<h2[^>]*>/g)];
  const fazit = heads.find((m) => /fazit/i.test(html.slice(m.index, html.indexOf('</h2>', m.index))));
  const at = fazit ? fazit.index : heads.length ? heads[heads.length - 1].index : html.length;
  return html.slice(0, at) + block + html.slice(at);
}

/** Rechner nur, wenn er wirklich zum Produkt passt. */
export function rechnerFor(review) {
  return null; // diese Seite hat (noch) keine Rechner
}

// Datum mit Uhrzeit und Zeitzone für strukturierte Daten (Google verlangt das z. B. bei uploadDate):
// 2026-10-12 -> 2026-10-12T08:00:00+02:00 (Sommerzeit) bzw. +01:00 (Winterzeit)
export function isoZeit(review) {
  const lokal = String(review.publishAt || `${review.published}T08:00`).slice(0, 16);
  const tz = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Berlin', timeZoneName: 'shortOffset' })
    .formatToParts(new Date(`${lokal}:00Z`)).find((p) => p.type === 'timeZoneName')?.value || 'GMT+1';
  const m = tz.match(/GMT([+-])(\d+)/);
  return `${lokal}:00${m ? `${m[1]}${m[2].padStart(2, '0')}:00` : '+01:00'}`;
}
