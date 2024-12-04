import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  labels: {
    singular: {
      es: 'Categoría'
    },
    plural: {
      es: 'Categorías'
    }
  },
  fields: [
    {
        name: 'name',
        type: 'text',
        label: {
          es: 'Nombre'
        },
        required: true,
    },
  ]
}
