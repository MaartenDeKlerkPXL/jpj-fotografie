import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

// Studio is nu gekoppeld aan het echte Sanity-project (v78po3b2). De site
// zelf (js/sanity.js) blijft desondanks bewust op de lokale fallback draaien
// — zie de toelichting daar. Deze Studio is dus wél live en bruikbaar voor
// Jack om foto's/teksten te beheren, ook al leest de site die data nog niet.
export default defineConfig({
  name: 'jpj-fotografie',
  title: 'JPJ Fotografie',

  projectId: 'v78po3b2',
  dataset: 'production',

  plugins: [
    // Eenvoudige zijbalk: losse singletons voor "Over mij" en "Site-instellingen",
    // zodat Jacques niet per ongeluk dubbele documenten aanmaakt.
    structureTool({
      structure: (S) =>
        S.list()
          .title('Inhoud')
          .items([
            S.listItem()
              .title('Site-instellingen')
              .child(S.document().schemaType('instellingen').documentId('instellingen')),
            S.listItem()
              .title('Pagina-teksten')
              .child(S.document().schemaType('siteTeksten').documentId('siteTeksten')),
            S.listItem()
              .title('Over mij')
              .child(S.document().schemaType('overMij').documentId('overMij')),
            S.divider(),
            S.documentTypeListItem('categorie').title('Categorieën'),
            S.documentTypeListItem('foto').title("Foto's"),
            S.documentTypeListItem('faq').title('Veelgestelde vragen')
          ])
    }),
    visionTool()
  ],

  schema: {
    types: schemaTypes
  }
})
