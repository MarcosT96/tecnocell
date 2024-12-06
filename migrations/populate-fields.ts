import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-vercel-postgres'
import { sql } from '@vercel/postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  try {
    // 1. Primero obtenemos todos los pedidos existentes
    const existingOrders = await payload.find({
      collection: 'orders',
      limit: 1000,
    })

    // 2. Creamos la columna nueva usando el cliente de Vercel
    await sql`
      ALTER TABLE "orders"
      ADD COLUMN IF NOT EXISTS "order_number" TEXT;
    `

    // 3. Actualizamos cada orden existente preservando su ID
    for (const order of existingOrders.docs) {
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: {
          orderNumber: `Pedido N ${order.id}`,
          ...order,
          customer: order.customer || order.id,
          items: order.items || [],
        }
      })
    }

  } catch (error) {
    console.error('Error en la migración:', error)
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // No hacemos nada en down para preservar datos
  return
}