export default {
  name: 'foto',
  title: "Foto's",
  type: 'document',
  fields: [
    {
      name: 'afbeelding',
      title: 'Afbeelding',
      type: 'image',
      options: { hotspot: true },
      validation: R => R.required()
    },
    {
      name: 'altTekst',
      title: 'Alt-tekst',
      type: 'string',
      description: 'Korte beschrijving van de foto (voor zoekmachines). Bijv. "Bruidspaar bij kasteel in Maastricht"',
      validation: R => R.required()
    },
    {
      name: 'categorie',
      title: 'Categorie',
      type: 'reference',
      to: [{ type: 'categorie' }],
      validation: R => R.required()
    },
    {
      name: 'uitgelicht',
      title: 'Tonen op homepage?',
      type: 'boolean',
      description: 'Maximaal 6 foto\'s uitlichten voor de homepage.',
      initialValue: false
    },
    {
      name: 'volgorde',
      title: 'Volgorde in galerij',
      type: 'number',
      description: 'Lager = eerder zichtbaar. Laat leeg voor automatische volgorde.'
    },
    {
      name: 'datum',
      title: 'Datum fotosessie',
      type: 'date',
      description: 'Optioneel — alleen voor eigen administratie.'
    }
  ],
  orderings: [
    { title: 'Volgorde', name: 'volgorde', by: [{ field: 'volgorde', direction: 'asc' }] },
    { title: 'Nieuwste eerst', name: 'datumDesc', by: [{ field: 'datum', direction: 'desc' }] }
  ],
  preview: {
    select: { title: 'altTekst', subtitle: 'categorie.naam', media: 'afbeelding' }
  }
}
