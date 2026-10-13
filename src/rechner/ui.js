// Kleine Helfer für die Rechner-Seiten (laufen im Browser des Besuchers).
export const $ = (id) => document.getElementById(id);
export const num = (id) => {
  const el = $(id);
  if (!el) return 0;
  const v = parseFloat(String(el.value).replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(v) && v > 0 ? v : 0;
};
export const val = (id) => ($(id) ? $(id).value : '');
export const checked = (id) => Boolean($(id) && $(id).checked);
export const fmt = (n, d = 0) => Number(n).toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: d });
export const eur = (n) => Number(n).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
export function bind(root, fn) {
  const run = () => { try { fn(); } catch (e) { console.error(e); } };
  root.addEventListener('input', run);
  root.addEventListener('change', run);
  run();
}
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const radio = (name) => {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : '';
};
/** Uhrzeit-Feld -> Minuten seit Mitternacht (oder null). */
export const zeitVon = (id) => {
  const el = $(id);
  const m = el && String(el.value).match(/^(\d{1,2}):(\d{2})/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};
/** Zahl auch 0 zulassen (num() liefert 0 für leer). */
export const zahl = (id) => {
  const el = $(id);
  if (!el || String(el.value).trim() === '') return null;
  const v = parseFloat(String(el.value).replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(v) && v >= 0 ? v : null;
};
/** Amazon-Suchknopf mit Partner-Tag der Seite (für das Ergebnisfeld). */
export function amazon(text, suche) {
  const tag = document.querySelector('[data-tag]')?.dataset.tag || '';
  const url = `https://www.amazon.de/s?k=${encodeURIComponent(suche)}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`;
  return `<div class="se-res-buy"><a class="se-btn" href="${url}" target="_blank" rel="nofollow sponsored noopener">${text}<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg></a></div>`;
}
export const amazonHinweis = '<small class="se-res-buy-note">Partnerlink: Kaufst du darüber ein, erhalten wir eine kleine Provision. Dein Preis ändert sich nicht.</small>';
