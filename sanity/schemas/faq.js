export default {
  name: 'faq',
  title: 'Veelgestelde vragen',
  type: 'document',
  fields: [
    {
      name: 'vraag',
      title: 'Vraag',
      type: 'string',
      validation: R => R.required()
    },
    {
      name: 'antwoord',
      title: 'Antwoord',
      type: 'text',
      rows: 3,
      validation: R => R.required()
    },
    {
      name: 'volgorde',
      title: 'Volgorde',
      type: 'number',
      description: 'Lager = eerder zichtbaar op de contactpagina.'
    }
  ],
  orderings: [
    { title: 'Volgorde', name: 'volgorde', by: [{ field: 'volgorde', direction: 'asc' }] }
  ],
  preview: {
    select: { title: 'vraag' }
  }
}
