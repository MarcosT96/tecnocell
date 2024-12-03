import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: {
      es: 'Producto'
    },
    plural: {
      es: 'Productos'
    }
  },
  admin: {
    useAsTitle: 'name' // Asumiendo que tienes un campo 'name' en tus productos
  },
  // access: {
  //   read: () => true,
  // },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: {
        es: 'Nombre del Producto'
      },
      required: true,
    },
    {
      name: 'quantity',
      type: 'number',
      label: {
        es: 'Cantidad'
      },
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      label: {
        es: 'Precio'
      },
      required: false,
    },
    {
      name: 'description',
      type: 'text',
      label: {
        es: 'Descripción'
      },
      required: false,
    },
  ]
}
