// Rechenlogik aller Schlaf-Rechner. Reine Funktionen ohne Browser-Bezug, damit sie getestet werden können.
// Quellen stehen jeweils am Wert. Alles sind Orientierungswerte, keine Diagnose.

/* ------------------------------------------------------------------ Uhrzeit-Helfer */

/** "07:30" -> 450 (Minuten seit Mitternacht). Ungültig -> null. */
export function minuten(hhmm) {
  const m = String(hhmm || '').trim().match(/^(\d{1,2})[:.](\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]), mi = Number(m[2]);
  if (h > 23 || mi > 59) return null;
  return h * 60 + mi;
}
/** 450 -> "07:30" (läuft über Mitternacht weiter). */
export function uhr(min) {
  const t = ((Math.round(min) % 1440) + 1440) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
}
/** 450 -> "7 Std. 30 Min." */
export function dauer(min) {
  const m = Math.round(min);
  const h = Math.floor(Math.abs(m) / 60), r = Math.abs(m) % 60;
  const s = h && r ? `${h} Std. ${r} Min.` : h ? `${h} Std.` : `${r} Min.`;
  return m < 0 ? `−${s}` : s;
}
/** Zeitspanne von a bis b in Minuten, über Mitternacht hinweg (0–1439). */
export function spanne(a, b) {
  return (((b - a) % 1440) + 1440) % 1440;
}

/* ------------------------------------------------------------------ 1. Schlafzyklus */

/** Ein Schlafzyklus dauert im Schnitt etwa 90 Minuten (Spanne ca. 80–110). */
export const ZYKLUS_MIN = 90;

/**
 * modus 'aufstehen': Ich will um zeit aufstehen -> wann ins Bett?
 * modus 'insbett':   Ich gehe um zeit ins Bett -> wann aufstehen?
 */
export function schlafzyklus({ modus = 'aufstehen', zeit = 0, einschlafMin = 15, zyklen = [6, 5, 4, 3] }) {
  return zyklen.map((n) => {
    const schlaf = n * ZYKLUS_MIN;
    const t = modus === 'aufstehen' ? zeit - schlaf - einschlafMin : zeit + einschlafMin + schlaf;
    return { zyklen: n, schlafMin: schlaf, zeit: uhr(t) };
  });
}

/* ------------------------------------------------------------------ 2. Schlafbedarf nach Alter */

/**
 * National Sleep Foundation, Hirshkowitz et al. 2015 (Sleep Health 1:40–43).
 * empfohlen = recommended, passt = „may be appropriate“ (unterer und oberer Rand).
 */
export const NSF = [
  { id: 'neugeboren', name: 'Neugeborene (0–3 Monate)', bisMonate: 3, empfohlen: [14, 17], passt: [11, 19] },
  { id: 'saeugling', name: 'Säuglinge (4–11 Monate)', bisMonate: 11, empfohlen: [12, 15], passt: [10, 18] },
  { id: 'kleinkind', name: 'Kleinkinder (1–2 Jahre)', bisMonate: 35, empfohlen: [11, 14], passt: [9, 16] },
  { id: 'vorschule', name: 'Kindergartenkinder (3–5 Jahre)', bisMonate: 71, empfohlen: [10, 13], passt: [8, 14] },
  { id: 'schulkind', name: 'Schulkinder (6–13 Jahre)', bisMonate: 167, empfohlen: [9, 11], passt: [7, 12] },
  { id: 'jugend', name: 'Jugendliche (14–17 Jahre)', bisMonate: 215, empfohlen: [8, 10], passt: [7, 11] },
  { id: 'jungerw', name: 'Junge Erwachsene (18–25 Jahre)', bisMonate: 311, empfohlen: [7, 9], passt: [6, 11] },
  { id: 'erwachsen', name: 'Erwachsene (26–64 Jahre)', bisMonate: 779, empfohlen: [7, 9], passt: [6, 10] },
  { id: 'senior', name: 'Ältere Erwachsene (ab 65 Jahren)', bisMonate: Infinity, empfohlen: [7, 8], passt: [5, 9] },
];
export function altersgruppe(monate) {
  return NSF.find((g) => monate <= g.bisMonate) || NSF[NSF.length - 1];
}
export function schlafbedarf({ monate = 0, aufstehen = null, einschlafMin = 15 }) {
  const g = altersgruppe(monate);
  const mitteH = (g.empfohlen[0] + g.empfohlen[1]) / 2;
  const res = { gruppe: g, mitteH };
  if (aufstehen !== null && monate >= 36) {
    // Ab dem Kindergartenalter wird der Bedarf fast ganz nachts gedeckt
    res.bettVon = uhr(aufstehen - g.empfohlen[1] * 60 - einschlafMin);
    res.bettBis = uhr(aufstehen - g.empfohlen[0] * 60 - einschlafMin);
  }
  return res;
}

/* ------------------------------------------------------------------ 3. Schlafschulden */

/** naechte: Schlafstunden der letzten 7 Nächte, bedarfH: persönlicher Bedarf pro Nacht. */
export function schlafschulden({ naechte = [], bedarfH = 8 }) {
  const gueltig = naechte.filter((n) => Number.isFinite(n) && n >= 0);
  const defizite = gueltig.map((n) => Math.max(0, bedarfH - n));
  const ueber = gueltig.map((n) => Math.max(0, n - bedarfH));
  const schuld = defizite.reduce((a, b) => a + b, 0);
  const plus = ueber.reduce((a, b) => a + b, 0);
  const schnitt = gueltig.length ? gueltig.reduce((a, b) => a + b, 0) / gueltig.length : 0;
  const netto = Math.max(0, schuld - plus);
  // Abbau: höchstens etwa 1 Stunde zusätzlich pro Nacht, damit der Rhythmus stabil bleibt
  const tageAbbau = Math.ceil(netto / 1);
  return { schuld, plus, netto, schnitt, naechte: gueltig.length, tageAbbau, kurzeNaechte: defizite.filter((d) => d >= 1).length };
}

/* ------------------------------------------------------------------ 4. Powernap */

export const NAP_ARTEN = {
  kurz: { min: 20, name: 'Powernap (20 Minuten)' },
  nasa: { min: 26, name: 'NASA-Nap (26 Minuten)' },
  zyklus: { min: 90, name: 'Ganzer Schlafzyklus (90 Minuten)' },
};
export function powernap({ start = 0, art = 'kurz', einschlafMin = 10 }) {
  const a = NAP_ARTEN[art] || NAP_ARTEN.kurz;
  const wecker = start + einschlafMin + a.min;
  const startStd = (((start % 1440) + 1440) % 1440) / 60;
  return { wecker: uhr(wecker), schlafMin: a.min, liegeMin: einschlafMin + a.min, spaet: startStd >= 15 || startStd < 5, art: a };
}

/* ------------------------------------------------------------------ 5. Schlafeffizienz */

/**
 * Schlafeffizienz = Schlafzeit ÷ Zeit im Bett × 100.
 * National Sleep Foundation (Ohayon et al. 2017, Sleep Health 3:6–19): mind. 85 % = gute Schlafqualität,
 * Einschlafen in höchstens 30 Minuten, Wachzeit nach dem Einschlafen höchstens 20 Minuten.
 */
export function schlafeffizienz({ bett = 0, auf = 0, einschlafMin = 0, wachMin = 0, liegenMin = 0 }) {
  const imBett = spanne(bett, auf);
  const schlaf = Math.max(0, imBett - einschlafMin - wachMin - liegenMin);
  const eff = imBett > 0 ? (schlaf / imBett) * 100 : 0;
  const stufe = eff >= 85 ? 'gut' : eff >= 75 ? 'mittel' : 'niedrig';
  return { imBett, schlaf, eff, stufe, einschlafOk: einschlafMin <= 30, wachOk: wachMin <= 20 };
}

/* ------------------------------------------------------------------ 6. Chronotyp (rMEQ) */

/**
 * Reduzierter Morningness-Eveningness-Fragebogen (rMEQ) nach Adan & Almirall 1991
 * (Personality and Individual Differences 12:241–253): 5 Fragen aus dem MEQ von Horne & Östberg 1976.
 * Summe 4–25. Einteilung: 4–7 klarer Abendtyp, 8–11 eher Abendtyp, 12–17 Neutraltyp, 18–21 eher Morgentyp, 22–25 klarer Morgentyp.
 */
export const RMEQ = [
  {
    id: 'q1',
    frage: 'Wenn du deinen Tag völlig frei planen könntest: Um wie viel Uhr würdest du aufstehen?',
    antworten: [['05:00–06:30 Uhr', 5], ['06:30–07:45 Uhr', 4], ['07:45–09:45 Uhr', 3], ['09:45–11:00 Uhr', 2], ['11:00–12:00 Uhr', 1]],
  },
  {
    id: 'q2',
    frage: 'Wie fühlst du dich in der ersten halben Stunde nach dem Aufwachen?',
    antworten: [['Sehr müde', 1], ['Ziemlich müde', 2], ['Ziemlich frisch', 3], ['Sehr frisch', 4]],
  },
  {
    id: 'q3',
    frage: 'Um wie viel Uhr abends wirst du müde und hast das Bedürfnis zu schlafen?',
    antworten: [['20:00–21:00 Uhr', 5], ['21:00–22:15 Uhr', 4], ['22:15–00:45 Uhr', 3], ['00:45–02:00 Uhr', 2], ['02:00–03:00 Uhr', 1]],
  },
  {
    id: 'q4',
    frage: 'Zu welcher Tageszeit fühlst du dich am besten?',
    antworten: [['05:00–08:00 Uhr', 5], ['08:00–10:00 Uhr', 4], ['10:00–17:00 Uhr', 3], ['17:00–22:00 Uhr', 2], ['22:00–05:00 Uhr', 1]],
  },
  {
    id: 'q5',
    frage: 'Man spricht von „Morgenmenschen“ und „Abendmenschen“. Welcher Typ bist du?',
    antworten: [['Eindeutig ein Morgentyp', 6], ['Eher ein Morgentyp', 4], ['Eher ein Abendtyp', 2], ['Eindeutig ein Abendtyp', 0]],
  },
];
export const CHRONOTYPEN = [
  { bis: 7, id: 'abend2', name: 'Klarer Abendtyp (Eule)' },
  { bis: 11, id: 'abend1', name: 'Eher Abendtyp' },
  { bis: 17, id: 'neutral', name: 'Neutraltyp' },
  { bis: 21, id: 'morgen1', name: 'Eher Morgentyp' },
  { bis: 25, id: 'morgen2', name: 'Klarer Morgentyp (Lerche)' },
];
export function chronotyp(punkte = []) {
  if (punkte.length !== RMEQ.length || punkte.some((p) => !Number.isFinite(p))) return null;
  const summe = punkte.reduce((a, b) => a + b, 0);
  return { summe, typ: CHRONOTYPEN.find((t) => summe <= t.bis) };
}

/* ------------------------------------------------------------------ 7. Koffein */

/**
 * Halbwertszeit von Koffein: im Mittel etwa 5 Stunden (Spanne ca. 1,5–9,5 h). Rauchen verkürzt sie,
 * die Pille und eine Schwangerschaft verlängern sie deutlich.
 * EFSA 2015: bis 400 mg pro Tag und 200 mg als Einzeldosis unbedenklich, in der Schwangerschaft bis 200 mg pro Tag;
 * schon 100 mg kurz vor dem Schlafen können bei manchen Erwachsenen den Schlaf beeinflussen.
 * Drake et al. 2013 (J Clin Sleep Med 9:1195): 400 mg sechs Stunden vor dem Schlafen verkürzten den Schlaf um über eine Stunde.
 */
export const HALBWERTSZEIT = { schnell: 3, normal: 5, langsam: 10 };
export const GETRAENKE = [
  { id: 'filter', name: 'Filterkaffee (Tasse, 200 ml)', mg: 90 },
  { id: 'espresso', name: 'Espresso (60 ml)', mg: 80 },
  { id: 'cappu', name: 'Cappuccino / Latte (1 Espresso)', mg: 80 },
  { id: 'tee', name: 'Schwarzer Tee (Tasse, 220 ml)', mg: 50 },
  { id: 'gruen', name: 'Grüner Tee (Tasse, 220 ml)', mg: 30 },
  { id: 'cola', name: 'Cola (Dose, 330 ml)', mg: 35 },
  { id: 'energy', name: 'Energydrink (Dose, 250 ml)', mg: 80 },
  { id: 'schoko', name: 'Zartbitterschokolade (50 g)', mg: 25 },
];
export function koffein({ einnahmen = [], schlafen = 1380, halbwertszeitH = 5, schwanger = false }) {
  // Getränke vor dem Schlafen: liegt die Schlafenszeit nach Mitternacht, zählt sie zum Folgetag
  const rest = einnahmen.reduce((sum, e) => {
    const h = spanne(e.zeit, schlafen) / 60;
    return sum + e.mg * Math.pow(0.5, h / halbwertszeitH);
  }, 0);
  const gesamt = einnahmen.reduce((a, e) => a + e.mg, 0);
  const grenze = schwanger ? 200 : 400;
  const stufe = rest < 50 ? 'gering' : rest < 100 ? 'mittel' : 'hoch';
  return { rest, gesamt, grenze, stufe, zuViel: gesamt > grenze, letzterKaffee: uhr(schlafen - 6 * 60) };
}

/* ------------------------------------------------------------------ 8. Jetlag und Zeitumstellung */

/**
 * Die innere Uhr stellt sich nach Flügen nach Osten um etwa 1 Stunde pro Tag um, nach Westen um etwa 1,5 Stunden
 * (z. B. IOGP/IPIECA Fatigue Sheet „Jet lag“, nach Waterhouse et al.). Vorab anpassen: einige Tage vorher
 * die Schlafzeit um je etwa 1 Stunde in Richtung Zielzeit verschieben (CDC Yellow Book).
 */
export function jetlag({ zonen = 0, richtung = 'ost', bett = 1380, auf = 420, tageVorher = 3 }) {
  const z = Math.max(0, Math.round(zonen));
  const rate = richtung === 'ost' ? 1 : 1.5;
  const tage = z <= 2 ? 0 : Math.ceil(z / rate);
  const schritt = richtung === 'ost' ? -60 : 60;
  const vorab = z >= 3 ? Array.from({ length: Math.min(tageVorher, z) }, (_, i) => ({ tag: Math.min(tageVorher, z) - i, bett: uhr(bett + schritt * (i + 1)), auf: uhr(auf + schritt * (i + 1)) })) : [];
  return { tage, rate, vorab, gering: z <= 2 };
}
/** Zeitumstellung: in den 4 Tagen davor jeweils 15 Minuten verschieben. */
export function zeitumstellung({ art = 'sommer', bett = 1380, auf = 420, tage = 4 }) {
  const schritt = art === 'sommer' ? -15 : 15; // Sommerzeit: Uhr vor, also früher ins Bett
  return Array.from({ length: tage }, (_, i) => ({ tag: tage - i, bett: uhr(bett + schritt * (i + 1)), auf: uhr(auf + schritt * (i + 1)) }));
}

/* ------------------------------------------------------------------ 9. Schichtarbeit */

export function schicht({ art = 'frueh', beginn = 360, ende = 840, wegMin = 30, schlafH = 7.5, einschlafMin = 15 }) {
  const schlaf = schlafH * 60;
  if (art === 'frueh') {
    const aufstehen = beginn - wegMin - 45;
    return { aufstehen: uhr(aufstehen), bett: uhr(aufstehen - schlaf - einschlafMin) };
  }
  if (art === 'spaet') {
    const bett = ende + wegMin + 60;
    return { bett: uhr(bett), aufstehen: uhr(bett + einschlafMin + schlaf) };
  }
  // Nacht: Hauptschlaf möglichst direkt nach der Heimkehr, dazu ein Nickerchen vor der nächsten Schicht
  const heim = ende + wegMin;
  const hauptStart = heim + 30;
  const hauptEnde = hauptStart + Math.min(schlaf, 7 * 60);
  const napEnde = beginn - wegMin - 60;
  return { heim: uhr(heim), bett: uhr(hauptStart), aufstehen: uhr(hauptEnde), napStart: uhr(napEnde - 90), napEnde: uhr(napEnde) };
}

/* ------------------------------------------------------------------ 10. Babyschlaf */

/**
 * Gesamtschlaf: National Sleep Foundation 2015 (siehe NSF). Wachfenster und Zahl der Nickerchen sind
 * Erfahrungswerte aus der Kinderschlaf-Beratung – keine medizinische Norm. Jedes Kind ist anders.
 */
export const BABY = [
  { bis: 2, name: '0–2 Monate', wach: [45, 60], naps: null, napH: null },
  { bis: 3, name: '2–3 Monate', wach: [60, 90], naps: 4, napH: 1 },
  { bis: 4, name: '3–4 Monate', wach: [75, 105], naps: 4, napH: 1 },
  { bis: 5, name: '4–5 Monate', wach: [90, 120], naps: 3, napH: 1.25 },
  { bis: 7, name: '5–7 Monate', wach: [120, 150], naps: 3, napH: 1 },
  { bis: 9, name: '7–9 Monate', wach: [150, 180], naps: 2, napH: 1.5 },
  { bis: 12, name: '9–12 Monate', wach: [180, 240], naps: 2, napH: 1.25 },
  { bis: 15, name: '12–15 Monate', wach: [210, 270], naps: 2, napH: 1.25 },
  { bis: 24, name: '15–24 Monate', wach: [300, 360], naps: 1, napH: 2 },
  { bis: 36, name: '2–3 Jahre', wach: [330, 390], naps: 1, napH: 1.5 },
];
export function babyschlaf({ monate = 6, aufwachen = 420 }) {
  const b = BABY.find((x) => monate < x.bis) || BABY[BABY.length - 1];
  const nsf = altersgruppe(Math.max(0, Math.floor(monate)));
  if (!b.naps) return { band: b, nsf, plan: null };
  const ww = (b.wach[0] + b.wach[1]) / 2;
  const plan = [];
  let t = aufwachen;
  plan.push({ was: 'Aufwachen', zeit: uhr(t) });
  for (let i = 1; i <= b.naps; i++) {
    t += ww;
    const len = b.napH * 60;
    plan.push({ was: `Nickerchen ${i}`, zeit: uhr(t), bis: uhr(t + len) });
    t += len;
  }
  t += ww;
  plan.push({ was: 'Schlafenszeit', zeit: uhr(t) });
  const tagschlaf = b.naps * b.napH;
  const nacht = spanne(t, aufwachen) / 60;
  return { band: b, nsf, plan, bett: uhr(t), tagschlafH: tagschlaf, nachtH: nacht, gesamtH: tagschlaf + nacht };
}

/* ------------------------------------------------------------------ 11. Matratzen-Härtegrad */

/**
 * Härtegrade (H1–H5) sind nicht genormt; jeder Hersteller legt sie selbst fest. Die gängige Faustregel nach Körpergewicht:
 * H1 bis 60 kg, H2 60–80 kg, H3 80–100 kg, H4 100–130 kg, H5 ab 130 kg. Bauchschläfer brauchen eher eine Stufe fester,
 * damit das Becken nicht durchhängt. Seitenschläfer profitieren von einer guten Schulterzone.
 */
export const HAERTE = [[60, 1], [80, 2], [100, 3], [130, 4], [Infinity, 5]];
export function haertegrad({ gewicht = 0, groesse = 0, lage = 'seite' }) {
  const basis = HAERTE.find(([g]) => gewicht <= g)[1];
  let h = basis;
  if (lage === 'bauch') h = Math.min(5, basis + 1);
  const bmi = groesse > 0 ? gewicht / Math.pow(groesse / 100, 2) : 0;
  const grenze = HAERTE.find(([g]) => gewicht <= g)[0];
  const nahObergrenze = Number.isFinite(grenze) && grenze - gewicht <= 3;
  return { h, basis, bmi, nahObergrenze };
}

/* ------------------------------------------------------------------ 12. Bett- und Matratzengröße */

export const LAENGEN = [190, 200, 210, 220];
export const BREITEN_1 = [80, 90, 100, 120, 140];
export const BREITEN_2 = [140, 160, 180, 200];
/** Faustregel: Liegefläche mindestens Körpergröße + 20 cm, bequemer + 30 cm. Pro Person mindestens 80 cm, besser 90–100 cm. */
export function bettgroesse({ groesse = 0, groesse2 = 0, personen = 1 }) {
  const lang = Math.max(groesse, personen === 2 ? groesse2 : 0);
  const minL = lang + 20;
  const laenge = LAENGEN.find((l) => l >= minL) || null;
  const laengeKomfort = LAENGEN.find((l) => l >= lang + 30) || null;
  const breite = personen === 2 ? { min: 160, gut: 180, gross: 200 } : { min: 90, gut: 100, gross: 140 };
  return { minL, laenge, laengeKomfort, breite, ueberlaenge: !laenge };
}

/* ------------------------------------------------------------------ 13. Kissenhöhe */

/**
 * Seitenlage: Das Kissen füllt den Abstand zwischen Matratze und Kopf, also etwa die Strecke Halsansatz–Schulteraußenkante,
 * abzüglich der Schulter, die in die Matratze einsinkt (weich mehr, fest weniger).
 * Rückenlage: flacher, Kopf nicht nach vorn gekippt. Bauchlage: sehr flach oder ohne Kissen.
 */
export const EINSINKEN = { weich: 4, mittel: 3, fest: 2 };
export function kissenhoehe({ schulterCm = 0, lage = 'seite', matratze = 'mittel' }) {
  const s = EINSINKEN[matratze] ?? 3;
  if (lage === 'seite') {
    const h = Math.max(6, schulterCm - s);
    return { von: Math.round(h - 1), bis: Math.round(h + 1), mitte: h };
  }
  if (lage === 'ruecken') {
    const basis = schulterCm < 12 ? 6 : schulterCm > 15 ? 8 : 7;
    return { von: basis, bis: basis + 3, mitte: basis + 1.5 };
  }
  return { von: 0, bis: 6, mitte: 3 };
}

/* ------------------------------------------------------------------ 14. Bettdecke */

/**
 * Wärmeklassen sind nicht genormt; viele Hersteller nutzen 1 (sehr leicht) bis 5 (extra warm).
 * Umweltbundesamt: Schlafzimmer 17–20 °C. Die Empfehlung richtet sich nach Raumtemperatur und Wärmeempfinden.
 */
export function bettdecke({ raumC = 18, typ = 'normal', groesse = 175, personen = 1 }) {
  let k = raumC >= 21 ? 1 : raumC >= 19 ? 2 : raumC >= 17 ? 3 : raumC >= 15 ? 4 : 5;
  if (typ === 'friert') k += 1;
  if (typ === 'schwitzt') k -= 1;
  k = Math.max(1, Math.min(5, k));
  const laenge = groesse + 20 <= 200 ? 200 : groesse + 20 <= 220 ? 220 : 240;
  const groessen = personen === 2 ? [`2 × 135 × ${laenge} cm (je eine Decke)`, `${laenge === 200 ? '200 × 200' : '200 × 220'} cm (gemeinsame Decke)`] : [`135 × ${laenge} cm`, `155 × ${laenge} cm (mehr Platz zum Einkuscheln)`];
  return { klasse: k, laenge, groessen };
}

/* ------------------------------------------------------------------ 15. Matratze austauschen */

/** Übliche Nutzungsdauer in Jahren (Hersteller- und Verbraucherangaben, meist 8–10 Jahre). */
export const MATRATZEN_JAHRE = {
  kaltschaum: { name: 'Kaltschaum', von: 8, bis: 10 },
  visko: { name: 'Viskoschaum (Memory Foam)', von: 7, bis: 10 },
  tfk: { name: 'Taschenfederkern', von: 8, bis: 10 },
  latex: { name: 'Latex', von: 10, bis: 12 },
  bonnell: { name: 'Bonnell-Federkern', von: 6, bis: 8 },
  boxspring: { name: 'Boxspring-Obermatratze', von: 8, bis: 10 },
};
export function matratzeAustausch({ typ = 'kaltschaum', kaufjahr = 2020, jetzt = 2026, gewicht = 75, wendet = true }) {
  const t = MATRATZEN_JAHRE[typ] || MATRATZEN_JAHRE.kaltschaum;
  let abzug = 0;
  if (gewicht > 100) abzug += 1;
  if (!wendet) abzug += 1;
  const von = Math.max(4, t.von - abzug), bis = Math.max(5, t.bis - abzug);
  const alter = jetzt - kaufjahr;
  return { typ: t, von, bis, alter, jahrVon: kaufjahr + von, jahrBis: kaufjahr + bis, faellig: alter >= von };
}

/* ------------------------------------------------------------------ 16. Betthöhe */

/**
 * Bequem ist eine Höhe, bei der beim Sitzen auf der Bettkante die Knie etwa im rechten Winkel stehen.
 * Die Kniekehlenhöhe beträgt rund ein Viertel der Körpergröße (DIN 33402: Mann 175 cm etwa 44 cm).
 * Beim Sitzen gibt die Matratze einige Zentimeter nach; dafür rechnen wir 4 cm dazu.
 * Komfort- bzw. Seniorenhöhe: etwas höher, damit das Aufstehen leichter fällt.
 */
export function betthoehe({ groesse = 175 }) {
  const knie = groesse * 0.25;
  const ideal = knie + 4;
  return { knie, ideal: Math.round(ideal), komfortVon: Math.round(ideal + 4), komfortBis: Math.round(ideal + 8) };
}

/* ------------------------------------------------------------------ 17. Kosten pro Nacht */

export function kostenProNacht({ preis = 0, jahre = 8, personen = 1 }) {
  const naechte = jahre * 365;
  const proNacht = naechte > 0 ? preis / naechte : 0;
  return { naechte, proNacht, proPerson: proNacht / Math.max(1, personen), proMonat: proNacht * 365 / 12 };
}

/* ------------------------------------------------------------------ 18. Schlafzimmer-Klima */

/** Umweltbundesamt: Schlafzimmer 17–20 °C. Relative Luftfeuchte: 40–60 % gilt als gut, über 60 % steigt die Schimmelgefahr. */
export function klima({ tempC = 18, rh = 50 }) {
  const temp = tempC < 15 ? 'kalt' : tempC < 17 ? 'kuehl' : tempC <= 20 ? 'ideal' : tempC <= 22 ? 'warm' : 'heiss';
  const feuchte = rh < 30 ? 'trocken' : rh < 40 ? 'etwas-trocken' : rh <= 60 ? 'ideal' : rh <= 70 ? 'feucht' : 'nass';
  return { temp, feuchte };
}

/* ------------------------------------------------------------------ 19. Lüften (CO2) */

/**
 * CO2-Leitwerte des Umweltbundesamts (2008): unter 1000 ppm hygienisch unbedenklich, 1000–2000 ppm auffällig,
 * über 2000 ppm inakzeptabel. Ein Mensch atmet je nach Aktivität etwa 10–80 Liter CO2 pro Stunde aus (UBA); im Schlaf am
 * unteren Ende – wir rechnen mit 12 Litern pro Person. Außenluft: rund 420 ppm.
 * C(t) = C_außen + G/(n·V) · (1 − e^(−n·t)), G = CO2-Ausstoß in m³/h, n = Luftwechsel pro Stunde, V = Raumvolumen.
 */
export const LUFTWECHSEL = { dicht: 0.1, normal: 0.3, kipp: 1.5 };
export const AUSSEN_PPM = 420;
export const CO2_PRO_PERSON = 0.012; // m³ pro Stunde im Schlaf
export function lueftung({ flaecheM2 = 14, hoeheM = 2.5, personen = 2, fenster = 'normal', stunden = 8 }) {
  const V = flaecheM2 * hoeheM;
  const n = LUFTWECHSEL[fenster] ?? 0.3;
  const G = personen * CO2_PRO_PERSON;
  const plateau = (G / (n * V)) * 1e6; // Anstieg im Gleichgewicht in ppm
  const ppm = (t) => AUSSEN_PPM + plateau * (1 - Math.exp(-n * t));
  const bis = (ziel) => {
    const anteil = (ziel - AUSSEN_PPM) / plateau;
    return anteil >= 1 ? null : -Math.log(1 - anteil) / n; // Stunden
  };
  const ende = ppm(stunden);
  return { V, n, ende, max: AUSSEN_PPM + plateau, bis1000: bis(1000), bis2000: bis(2000), stufe: ende < 1000 ? 'gut' : ende <= 2000 ? 'auffaellig' : 'schlecht' };
}

/* ------------------------------------------------------------------ 20. Schlafposition */

export function schlafposition({ lage = 'seite', beschwerden = [], schnarchen = false }) {
  const tipps = [];
  if (lage === 'seite') {
    tipps.push('Matratze mit guter Schulterzone, damit die Schulter einsinken kann und die Wirbelsäule gerade bleibt.');
    tipps.push('Höheres Kissen, das den Abstand zwischen Schulter und Kopf ausfüllt.');
  } else if (lage === 'ruecken') {
    tipps.push('Matratze, die den unteren Rücken stützt und das Becken nicht zu tief einsinken lässt.');
    tipps.push('Eher flaches Kissen, damit der Kopf nicht nach vorn kippt.');
  } else if (lage === 'bauch') {
    tipps.push('Eher feste Matratze, damit das Becken nicht durchhängt und kein Hohlkreuz entsteht.');
    tipps.push('Sehr flaches Kissen oder gar keins.');
  } else {
    tipps.push('Matratze mit mittlerem Härtegrad und Zonen, die in jeder Lage gut stützt.');
    tipps.push('Kissen mit verstellbarer Füllung, damit du die Höhe anpassen kannst.');
  }
  if (beschwerden.includes('nacken')) tipps.push('Bei Nackenverspannungen zuerst die Kissenhöhe prüfen – zu hoch oder zu flach ist die häufigste Ursache.');
  if (beschwerden.includes('schulter')) tipps.push('Drückt die Schulter in Seitenlage, ist die Matratze oft zu fest oder die Schulterzone zu schwach.');
  if (beschwerden.includes('ruecken')) tipps.push('Bei Schmerzen im unteren Rücken prüfen, ob die Matratze durchhängt (Kuhle) oder zu weich ist.');
  if (schnarchen) tipps.push('Wer in Rückenlage schnarcht, schnarcht in Seitenlage oft weniger. Lautes Schnarchen mit Atemaussetzern solltest du ärztlich abklären lassen.');
  return { tipps };
}
