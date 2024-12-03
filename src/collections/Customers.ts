import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'name' // Asumiendo que tienes un campo 'name' en tus clientes
  },
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
