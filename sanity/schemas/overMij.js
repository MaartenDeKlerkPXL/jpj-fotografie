export default {
  name: 'overMij',
  title: 'Over mij',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'portretFoto',
      title: 'Jouw foto (groot formaat)',
      type: 'image',
      options: { hotspot: true },
      description: 'Horizontaal formaat werkt het beste — minimaal 1400px breed.'
    },
    {
      name: 'citaat',
      title: 'Citaat voor homepage',
      type: 'string',
      description: 'Een korte, krachtige zin die op de homepage staat. Max 120 tekens.',
      validation: R => R.max(120)
    },
    {
      name: 'biografie',
      title: 'Jouw verhaal',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Jouw tekst, opgedeeld in alinea\'s. Gebruik de enter-toets voor een nieuwe alinea.'
    }
  ]
}
