import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

// BEWUSTE KEUZE VOOR V1: deze Studio is nog niet gekoppeld — de site draait op
// js/data.js. Pas 'YOUR_PROJECT_ID' hieronder én in js/sanity.js aan wanneer je
// in een latere versie alsnog voor een live Sanity-koppeling kiest.
export default defineConfig({
  name: 'jpj-fotografie',
  title: 'JPJ Fotografie',

  projectId: 'YOUR_PROJECT_ID',
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
            S.documentTypeListItem('foto').title("Foto's")
          ])
    }),
    visionTool()
  ],

  schema: {
    types: schemaTypes
  }
})
