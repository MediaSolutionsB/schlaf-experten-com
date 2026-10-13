// Liste aller Schlaf-Rechner (Übersicht, Menü, Sitemap, Querverweise).
// gruppe: Themenblock auf der Übersicht. kategorie: passende Beitrags-Kategorie (oder null).
export const gruppen = [
  { id: 'zeit', name: 'Schlafzeit und Rhythmus' },
  { id: 'bett', name: 'Matratze, Kissen und Bett' },
  { id: 'zimmer', name: 'Schlafzimmer' },
];

export const tools = [
  // Schlafzeit und Rhythmus
  { slug: 'schlafzyklus-rechner', name: 'Schlafzyklus-Rechner', kurz: 'Wann ins Bett, um ausgeschlafen aufzuwachen? Nach 90-Minuten-Zyklen.', gruppe: 'zeit', kategorie: null, icon: 'moon' },
  { slug: 'schlafbedarf-rechner', name: 'Schlafbedarf nach Alter', kurz: 'Wie viel Schlaf brauchen Baby, Kind, Jugendliche, Erwachsene und Senioren?', gruppe: 'zeit', kategorie: null, icon: 'clock' },
  { slug: 'schlafschulden-rechner', name: 'Schlafschulden-Rechner', kurz: 'Wie viel Schlaf fehlt dir nach einer Woche, und wie holst du ihn auf?', gruppe: 'zeit', kategorie: null, icon: 'battery' },
  { slug: 'powernap-rechner', name: 'Powernap-Rechner', kurz: 'Wann den Wecker stellen, damit der Mittagsschlaf erfrischt statt schlapp macht?', gruppe: 'zeit', kategorie: null, icon: 'sun' },
  { slug: 'schlafeffizienz-rechner', name: 'Schlafeffizienz-Rechner', kurz: 'Wie viel deiner Zeit im Bett schläfst du wirklich?', gruppe: 'zeit', kategorie: null, icon: 'chart' },
  { slug: 'chronotyp-test', name: 'Chronotyp-Test: Lerche oder Eule?', kurz: 'Bist du Morgen- oder Abendtyp? Kurzer Fragebogen mit 5 Fragen.', gruppe: 'zeit', kategorie: null, icon: 'person' },
  { slug: 'koffein-rechner', name: 'Koffein-Rechner', kurz: 'Wie viel Koffein ist zur Schlafenszeit noch im Körper?', gruppe: 'zeit', kategorie: null, icon: 'coffee' },
  { slug: 'jetlag-rechner', name: 'Jetlag- und Zeitumstellungs-Rechner', kurz: 'Wie lange dauert der Jetlag, und wie stellst du dich vorher um?', gruppe: 'zeit', kategorie: null, icon: 'plane' },
  { slug: 'schichtarbeit-schlafrechner', name: 'Schlafplaner für Schichtarbeit', kurz: 'Die besten Schlafzeiten bei Früh-, Spät- und Nachtschicht.', gruppe: 'zeit', kategorie: null, icon: 'shift' },
  { slug: 'babyschlaf-rechner', name: 'Babyschlaf-Rechner', kurz: 'Wie viel Schlaf, wie viele Nickerchen und welche Wachzeiten passen zum Alter?', gruppe: 'zeit', kategorie: null, icon: 'baby' },
  // Matratze, Kissen und Bett
  { slug: 'matratzen-haertegrad-rechner', name: 'Matratzen-Härtegrad-Rechner', kurz: 'H1, H2, H3, H4 oder H5? Nach Gewicht und Schlafposition.', gruppe: 'bett', kategorie: 'matratzen', icon: 'mattress' },
  { slug: 'schlafposition-test', name: 'Schlafpositions-Check', kurz: 'Welche Matratze und welches Kissen passen zu deiner Schlafposition?', gruppe: 'bett', kategorie: 'matratzen', icon: 'posture' },
  { slug: 'bettgroesse-rechner', name: 'Bettgröße-Rechner', kurz: 'Welche Länge und Breite brauchst du allein oder zu zweit?', gruppe: 'bett', kategorie: 'betten', icon: 'ruler' },
  { slug: 'betthoehe-rechner', name: 'Betthöhe-Rechner', kurz: 'Die ideale Einstiegshöhe nach Körpergröße, auch als Komforthöhe.', gruppe: 'bett', kategorie: 'betten', icon: 'stairs' },
  { slug: 'kissenhoehe-rechner', name: 'Kissenhöhe-Rechner', kurz: 'Wie hoch muss dein Kissen sein? Nach Schulterbreite und Schlafposition.', gruppe: 'bett', kategorie: 'kissen-zubehoer', icon: 'pillow' },
  { slug: 'bettdecken-rechner', name: 'Bettdecken-Rechner', kurz: 'Welche Wärmeklasse und welche Größe passen zu dir und deinem Schlafzimmer?', gruppe: 'bett', kategorie: 'kissen-zubehoer', icon: 'blanket' },
  { slug: 'matratze-austauschen-rechner', name: 'Wann neue Matratze?', kurz: 'Wann ist deine Matratze fällig? Nach Material, Alter und Nutzung.', gruppe: 'bett', kategorie: 'matratzen', icon: 'bed' },
  { slug: 'matratze-kosten-pro-nacht-rechner', name: 'Matratze: Kosten pro Nacht', kurz: 'Was kostet dich deine Matratze pro Nacht?', gruppe: 'bett', kategorie: 'matratzen', icon: 'euro' },
  // Schlafzimmer
  { slug: 'schlafzimmer-klima-rechner', name: 'Schlafzimmer-Klima-Check', kurz: 'Passen Temperatur und Luftfeuchtigkeit in deinem Schlafzimmer?', gruppe: 'zimmer', kategorie: null, icon: 'thermo' },
  { slug: 'schlafzimmer-lueften-rechner', name: 'Lüften im Schlafzimmer', kurz: 'Wie schnell wird die Luft nachts schlecht, und was hilft?', gruppe: 'zimmer', kategorie: null, icon: 'wind' },
];
