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
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'items', 'total', 'createdAt'],
    group: 'Tienda',
  },
  access: {
    // ... mantener permisos existentes ...
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      label: {
        es: 'N° Pedido'
      },
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          async ({ data, req, operation, originalDoc }) => {
            if (operation === 'create' && data) {
              const lastOrder = await req.payload.find({
                collection: 'orders',
                limit: 1,
              })
              const nextNumber = lastOrder.docs.length > 0 ? parseInt(String(lastOrder.docs[0].id)) + 1 : 1
              data.orderNumber = `Pedido N° ${nextNumber}`
            }
            return originalDoc?.orderNumber
          }
        ]
      }
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      index: true,
      label: {
        es: 'Cliente'
      },
    },
    {
      name: 'total',
      type: 'number',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            if (!data?.items || !Array.isArray(data.items)) return 0;
            
            let total = 0;
            for (const item of data.items) {
              const product = await req.payload.findByID({
                collection: 'products',
                id: item.productId,
              });
              
              if (product?.price) {
                total += product.price * item.quantity;
              }
            }
            
            return total;
          },
        ],
      },
    },
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
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        for (const item of data.items) {
          const product = await req.payload.findByID({
            collection: 'products',
            id: item.productId
          });

          if (product.quantity < item.quantity) {
            const error = new Error(`No hay suficiente stock del producto ${product.name}. Stock disponible: ${product.quantity}`);
            error.name = 'ValidationError';
            throw error;
          }
        }
        return data;
      }
    ],
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
    ],
    afterError: [
      async ({ error, result }) => {
        return {
          ...result,
          errors: [{
            message: error.message,
            name: 'ValidationError'
          }],
          status: 400
        }
      }
    ]
  },
}
