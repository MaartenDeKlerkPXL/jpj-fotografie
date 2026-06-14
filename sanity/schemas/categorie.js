export default {
  name: 'categorie',
  title: 'Categorieën',
  type: 'document',
  fields: [
    {
      name: 'naam',
      title: 'Naam',
      type: 'string',
      validation: R => R.required()
    },
    {
      name: 'slug',
      title: 'URL-naam',
      type: 'slug',
      options: { source: 'naam' },
      description: 'Wordt automatisch aangemaakt. Niet aanpassen na publicatie.',
      validation: R => R.required()
    },
    {
      name: 'coverFoto',
      title: 'Omslagfoto (voor het overzicht)',
      type: 'image',
      options: { hotspot: true },
      description: 'Foto die op de overzichtspagina wordt getoond bij deze categorie.'
    },
    {
      name: 'parentCategorie',
      title: 'Subcategorie van',
      type: 'reference',
      to: [{ type: 'categorie' }],
      description: 'Laat leeg als dit een hoofdcategorie is.'
    },
    {
      name: 'volgorde',
      title: 'Volgorde in menu',
      type: 'number'
    }
  ],
  preview: {
    select: { title: 'naam', media: 'coverFoto' }
  }
}
