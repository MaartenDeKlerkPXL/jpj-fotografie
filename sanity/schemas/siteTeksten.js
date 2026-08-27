export default {
  name: 'siteTeksten',
  title: 'Pagina-teksten',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'heroTitel',
      title: 'Homepage — grote titel',
      type: 'string',
      description: 'Bovenste woord in de hero. Bijv. "JPJ".'
    },
    {
      name: 'heroSubtitel',
      title: 'Homepage — cursieve ondertitel',
      type: 'string',
      description: 'Tweede regel in de hero. Bijv. "Fotografie".'
    },
    {
      name: 'aboutEyebrow',
      title: 'Homepage — labeltje boven het citaat',
      type: 'string',
      description: 'Klein label boven het citaat in het "over"-blok. Bijv. "Over Jacques".'
    },
    {
      name: 'portfolioTitel',
      title: 'Portfolio — titel',
      type: 'string'
    },
    {
      name: 'portfolioSubtitel',
      title: 'Portfolio — ondertitel',
      type: 'string'
    },
    {
      name: 'ctaTitel',
      title: 'Homepage CTA — titel',
      type: 'string',
      description: 'Bijv. "Klaar voor iets moois?"'
    },
    {
      name: 'ctaSubtitel',
      title: 'Homepage CTA — ondertitel',
      type: 'string'
    },
    {
      name: 'ctaKnop',
      title: 'Homepage CTA — knoptekst',
      type: 'string',
      description: 'Bijv. "Stuur een bericht →".'
    },
    {
      name: 'contactTitel',
      title: 'Contact — titel',
      type: 'string'
    },
    {
      name: 'contactSubtitel',
      title: 'Contact — ondertitel',
      type: 'string'
    }
  ],
  preview: {
    prepare() { return { title: 'Pagina-teksten' }; }
  }
}
