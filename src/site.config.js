// Zentrale Einstellungen für schlaf-experten.com
export const site = {
  name: 'Schlaf-Experten',
  domain: 'schlaf-experten.com',
  url: 'https://schlaf-experten.com',
  lang: 'de',
  tagline: 'Das Portal für gesunden Schlaf – Unabhängige Matratzen-Tests, Schlafberatung und Expertenwissen.',
  amazonTag: 'sl33p-21',
  service: {
    email: 'info@schlaf-experten.com',
    phone: '0711 25266369',
    phoneLink: '+4971125266369',
    street: 'Zeppelinstraße 19',
    zip: '71332',
    city: 'Waiblingen',
    areas: ['Stuttgart', 'Rems-Murr-Kreis'],
  },
  author: {
    name: 'Jakob Wagner',
    image: '/bilder/jakob-wagner.webp',
    bio: 'Schreibt auf schlaf-experten.com über Matratzen, Bettdecken, Kissen und alles, was mit gesundem Schlaf zu tun hat.',
  },
  types: {
    test: { base: 'test', label: 'Test', plural: 'Tests', more: 'Zum Test', intro: 'Ausführliche Praxistests mit ehrlicher Bewertung.' },
    check: { base: 'check', label: 'Check', plural: 'Checks', more: 'Zum Check', intro: 'Kurze Produkt-Checks mit unserer Einschätzung.' },
    info: { base: 'ratgeber', label: 'Ratgeber', plural: 'Ratgeber', more: 'Zum Ratgeber', intro: 'Verständliches Wissen für erholsamen Schlaf.' },
  },
  categories: [
    { slug: 'matratzen', name: 'Matratzen', text: 'Kaltschaum-, Federkern-, Latex- & Naturmatratzen im Härtetest', icon: 'mattress' },
    { slug: 'betten', name: 'Betten & Boxspring', text: 'Boxspringbetten, Massivholzbetten & Polsterbetten im Vergleich', icon: 'bed' },
    { slug: 'schlafsofas', name: 'Schlafsofas', text: 'Bequeme Schlafcouches und Gästebetten für Alltag und Besuch', icon: 'sofa' },
    { slug: 'kissen-zubehoer', name: 'Kissen & Zubehör', text: 'Ergonomische Nackenstützkissen, Topper & Bettwaren', icon: 'pillow' },
  ],
  services: [
    {
      id: 'schlafanalyse',
      tag: 'Analyse & Beratung',
      title: 'Schlafanalyse und Beratung',
      text: 'Wir schauen uns deine Schlafgewohnheiten, dein Schlafumfeld und deinen Tagesablauf an und zeigen dir, was du für besseren Schlaf tun kannst. Bei Verdacht auf eine Schlafstörung empfehlen wir dir den Weg zum Arzt.',
      points: ['Auswertung deiner Schlafgewohnheiten', 'Blick auf Bett, Matratze, Kissen und Schlafumfeld', 'Verständliche Auswertung und konkrete Tipps']
    },
    {
      id: 'schlafcoaching',
      tag: 'Coaching',
      title: 'Schlaf-Coaching für besseres Ein- und Durchschlafen',
      text: 'Persönliche Begleitung, um deine Schlafhygiene zu optimieren, Stress abzubauen und wieder zu erholsamem Schlaf zu finden. Praktische Methoden für erholsamen Schlaf.',
      points: ['Individuelle Analyse deiner Schlafgewohnheiten', 'Gezielte Methoden gegen Gedankenkreisen und Einschlafprobleme', 'Feste Routinen für langfristig tiefen und ruhigen Schlaf']
    },
    {
      id: 'workshops',
      tag: 'Wissen & Prävention',
      title: 'Workshops über Schlafgesundheit & Prävention',
      text: 'Spannende Seminare und Workshops für Firmen und Privatpersonen: Was bewirkt guter Schlaf für Immunsystem und Gehirn? Wie hängen Schlaf und Leistungsfähigkeit zusammen? Mit praxiserprobten Strategien.',
      points: ['Zusammenhänge zwischen Schlaf, Immunsystem & Herz-Kreislauf', 'Faktoren für maximale Regeneration & Leistungsfähigkeit', 'Für Unternehmen (BGM) und gesundheitsbewusste Gruppen']
    },
    {
      id: 'kaufberatung',
      tag: 'Vor Ort & Individuell',
      title: 'Matratzen-Kaufberatung & Probeliegen',
      text: 'Finde die perfekte Matratze für deinen Körpertyp und deine Schlafposition. Unabhängige Beratung, Probeliegen auf verschiedenen Kernarten (Latex, Kaltschaum, Taschenfederkern) und die passende Abstimmung von Lattenrost und Kissen.',
      points: ['Ermittlung des idealen Härtegrads für deine Wirbelsäule', 'Herstellerunabhängiges Probeliegen vor Ort', 'Abstimmung von Matratze, Topper, Lattenrost und Kissen']
    }
  ]
};
