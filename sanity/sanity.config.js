import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

// TODO: Vervang 'YOUR_PROJECT_ID' door jouw Sanity project-ID (sanity.io/manage)
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
