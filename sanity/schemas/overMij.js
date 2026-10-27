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
      description: 'Een staande of vierkante foto werkt het best, minimaal 1400 pixels breed.'
    },
    {
      name: 'naam',
      title: 'Naam',
      type: 'string',
      description: 'Jouw naam zoals die boven het verhaal verschijnt. Bijv. "Jacques Janssen".'
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
    },
    {
      name: 'diensten',
      title: 'Ik fotografeer (lijst)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Eén regel per dienst, bijv. "Bruiloften", "Newborn-shoots". Verschijnt op de Over mij-pagina.'
    }
  ]
}
