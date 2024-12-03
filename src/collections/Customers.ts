import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: {
    singular: {
      es: 'Cliente'
    },
    plural: {
      es: 'Clientes'
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
    {
        name: 'phone',
        type: 'text',
        label: {
            es: 'Teléfono'
        },
        required: false,
    },
    {
        name: 'instagram',
        type: 'text',
        required: false,
    },
  ],
}
