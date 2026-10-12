// SVG Icons
const wrap = (d) => `<svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

export const icons = {
  mattress: wrap('<rect x="2" y="7" width="20" height="10" rx="3"/><path d="M2 12h20M7 7v10M17 7v10"/>'),
  bed: wrap('<path d="M2 4v16M2 8h18a2 2 0 012 2v10M2 17h20M6 8v4"/>'),
  sofa: wrap('<path d="M20 9V7a2 2 0 00-2-2H6a2 2 0 00-2 2v2M2 11v5a2 2 0 002 2h16a2 2 0 002-2v-5a2 2 0 00-2-2H4a2 2 0 00-2 2zM4 18v2M20 18v2"/>'),
  pillow: wrap('<path d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z"/><path d="M8 12c2.5 1 5.5 1 8 0"/>'),
  lab: wrap('<path d="M2 12h2l3-6 4 12 3-9 2 5 2-2h4"/><circle cx="12" cy="12" r="10"/>'),
  moon: wrap('<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>'),
  heart: wrap('<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>'),
  check: wrap('<path d="M20 6L9 17l-5-5"/>'),
};

export const arrow = `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
