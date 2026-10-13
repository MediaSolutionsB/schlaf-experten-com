// SVG Icons
const wrap = (d) => `<svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

export const icons = {
  clock: wrap('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  coffee: wrap('<path d="M4 8h12v6a5 5 0 01-5 5H9a5 5 0 01-5-5V8z"/><path d="M16 10h2a2 2 0 010 4h-2"/><path d="M8 3v2M12 3v2"/>'),
  plane: wrap('<path d="M2 16l20-7-3-2-7 3-5-5-2 1 3 6-4 2-2-1-1 1 3 3z"/>'),
  baby: wrap('<circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01"/><path d="M9.5 15a3.5 3.5 0 005 0"/>'),
  thermo: wrap('<path d="M14 14.8V5a2 2 0 00-4 0v9.8a4 4 0 104 0z"/>'),
  wind: wrap('<path d="M3 8h11a3 3 0 10-3-3"/><path d="M3 12h16a3 3 0 11-3 3"/><path d="M3 16h8"/>'),
  chart: wrap('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
  sun: wrap('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  euro: wrap('<path d="M17 6a7 7 0 100 12"/><path d="M4 10h9M4 14h9"/>'),
  ruler: wrap('<rect x="2" y="8" width="20" height="8" rx="1.5"/><path d="M6 8v3M10 8v4M14 8v3M18 8v4"/>'),
  blanket: wrap('<path d="M3 6h18v12H3z"/><path d="M3 10h18M8 6v12"/>'),
  person: wrap('<circle cx="12" cy="5" r="2.5"/><path d="M4 21v-1a8 8 0 0116 0v1"/><path d="M9 21v-6h6v6"/>'),
  battery: wrap('<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 11v2"/><path d="M7 10v4M11 10v4"/>'),
  shift: wrap('<path d="M3 12a9 9 0 0115-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/><path d="M3 21v-5h5"/>'),
  stairs: wrap('<path d="M3 20h5v-5h5v-5h5V5h3"/>'),
  posture: wrap('<path d="M3 17h18"/><circle cx="6" cy="12" r="2"/><path d="M8 13h11v4"/>'),
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
