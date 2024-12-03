import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: {
      es: 'Orden'
    },
    plural: {
      es: 'Ordenes'
    }
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      label: {
        es: 'Productos'
      },
      fields: [
        {
          name: 'productId',
          type: 'relationship',
          relationTo: 'products',
          label: {
            es: 'Producto'
          },
          required: true
        },
        {
          name: 'quantity',
          type: 'number',
          label: {
            es: 'Cantidad'
          },
          required: true,
          defaultValue: 1,
          min: 1
        }
      ]
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      label: {
        es: 'Cliente'
      },
      required: false,
    },
  ],
  hooks: {
    afterChange: [
      async ({ 
        doc,      // documento actual (la orden)
        operation, // tipo de operación ('create' o 'update')
        req       // objeto request con acceso a payload
      }) => {
        if (operation === 'create') {
          // Iteramos sobre cada item en la orden
          if (Array.isArray(doc.items)) {
            for (const item of doc.items || []) {
              const product = await req.payload.findByID({
                collection: 'products',
                id: item.productId
              });
              
              await req.payload.update({
                collection: 'products',
                id: item.productId,
                data: {
                  quantity: product.quantity - item.quantity
                },
                context: {
                  preventUpdate: true
                }
              });
            }
          }
        }
      }
    ]
  },
}
