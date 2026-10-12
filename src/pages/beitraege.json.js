export async function GET() {
  const beitraege = [
    {
      title: 'Bruno Boxspringbett Test: Lohnt sich der Kauf?',
      slug: 'bruno-boxspringbett',
      category: 'betten',
      url: '/betten/bruno-boxspringbett/',
      image: '/bilder/beitraege/brunobett-boxspringbett.jpg'
    },
    {
      title: 'Bruno Schlafsofa Test: Lohnt sich der Kauf?',
      slug: 'bruno-schlafsofa',
      category: 'betten',
      url: '/betten/bruno-schlafsofa/',
      image: '/bilder/beitraege/Bruno-Schlafsofa-testbericht.jpg'
    },
    {
      title: 'Kipli Naturlatex Matratze: Unsere Erfahrungen & Test',
      slug: 'kipli-erfahrungen-test',
      category: 'matratzen',
      url: '/matratzen/kipli-erfahrungen-test/',
      image: '/bilder/beitraege/Kipli-Test.jpg'
    }
  ];

  return new Response(JSON.stringify(beitraege, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
