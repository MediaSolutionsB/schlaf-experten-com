// Zentrale Einstellungen für schlaf-experten.com
export const site = {
  name: 'Schlaf-Experten',
  domain: 'schlaf-experten.com',
  url: 'https://schlaf-experten.com',
  lang: 'de',
  tagline: 'Das Portal für gesunden Schlaf – Unabhängige Matratzen-Tests, Schlafberatung und Expertenwissen.',
  amazonTag: 'schlaf-experten-21',
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
    name: 'Tobias Bantle',
    image: '/bilder/schlaf-experten-icon.png',
    bio: 'Schlafexperte und zertifizierter Berater für Ergonomie, Schlafgesundheit und Bettsysteme.',
  },
  types: {
    test: { base: 'test', label: 'Test', plural: 'Tests', more: 'Zum Test', intro: 'Ausführliche Praxistests und Laborbewertungen.' },
    erfahrung: { base: 'erfahrungen', label: 'Erfahrungsbericht', plural: 'Erfahrungen', more: 'Zum Erfahrungsbericht', intro: 'Echte Langzeiterfahrungen aus dem Alltag.' },
    ratgeber: { base: 'ratgeber', label: 'Ratgeber', plural: 'Ratgeber', more: 'Zum Ratgeber', intro: 'Wissenschaftlich fundiertes Wissen für erholsamen Schlaf.' },
  },
  categories: [
    { slug: 'matratzen', name: 'Matratzen', text: 'Kaltschaum-, Federkern-, Latex- & Naturmatratzen im Härtetest', icon: 'mattress' },
    { slug: 'betten', name: 'Betten & Boxspring', text: 'Boxspringbetten, Massivholzbetten & Polsterbetten im Vergleich', icon: 'bed' },
    { slug: 'schlafsofas', name: 'Schlafsofas', text: 'Bequeme Schlafcouches und Gästebetten für Alltag und Besuch', icon: 'sofa' },
    { slug: 'kissen-zubehoer', name: 'Kissen & Zubehör', text: 'Ergonomische Nackenstützkissen, Topper & Bettwaren', icon: 'pillow' },
  ],
  services: [
    {
      id: 'schlaflabor',
      tag: 'Diagnose',
      title: 'Schlaflabor für Diagnose von Schlafproblemen',
      text: 'Gezielte Schlafanalyse bei Ein- und Durchschlafstörungen, Schnarchen oder ständiger Tagesmüdigkeit. Wir erfassen deine Schlafphasen, Sauerstoffsättigung und Bewegungsmuster für eine fundierte Auswertung.',
      points: ['Messung von Schlafarchitektur & Schlafphasen', 'Analyse von nächtlichen Atemaussetzern und Unruhe', 'Ausführlicher Befund und konkrete Handlungsempfehlungen']
    },
    {
      id: 'schlafcoaching',
      tag: 'Coaching',
      title: 'Schlaf-Coaching für besseres Ein- und Durchschlafen',
      text: 'Persönliche Begleitung, um deine Schlafhygiene zu optimieren, Stress abzubauen und wieder zu erholsamem Schlaf zu finden. Wissenschaftlich fundierte Methoden statt Schlaftabletten.',
      points: ['Individuelle Analyse deiner Schlafgewohnheiten', 'Gezielte Methoden gegen Gedankenkreisen und Einschlafprobleme', 'Feste Routinen für langfristig tiefen und ruhigen Schlaf']
    },
    {
      id: 'workshops',
      tag: 'Wissen & Prävention',
      title: 'Workshops über Schlafgesundheit & Prävention',
      text: 'Spannende Seminare und Workshops für Firmen und Privatpersonen: Was bewirkt guter Schlaf für Immunsystem und Gehirn? Welche Krankheiten entstehen durch chronischen Schlafmangel? Mit praxiserprobten Strategien.',
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
