export default {
  name: 'instellingen',
  title: 'Site-instellingen',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'tagline',
      title: 'Tagline (onder de naam op homepage)',
      type: 'string',
      description: 'Bijv. "Vakfotograaf in Zuid-Limburg"'
    },
    {
      name: 'contactFoto',
      title: 'Foto op de contactpagina',
      type: 'image',
      options: { hotspot: true },
      description: 'Verticaal formaat (staand) werkt het beste.'
    },
    {
      name: 'email',
      title: 'E-mailadres',
      type: 'string',
      description: 'Contact loopt uitsluitend via e-mail — er is bewust geen telefoonveld.'
    },
    {
      name: 'regio',
      title: 'Werkgebied',
      type: 'string',
      initialValue: 'Zuid-Limburg'
    }
  ]
}
