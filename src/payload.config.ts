import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { resendAdapter } from '@payloadcms/email-resend'
import { es } from '@payloadcms/translations/languages/es'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Orders } from './collections/Orders'
import { Customers } from './collections/Customers'
import { Categories } from './collections/Categories'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Products, Categories, Orders, Customers, Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Automatically uses proces.env.POSTGRES_URL if no options are provided.
  db: vercelPostgresAdapter(),
  sharp,
  plugins: [
    payloadCloudPlugin(),
  ],
  i18n: {
    supportedLanguages: { es },
    fallbackLanguage: 'es', // default
  },
  email: resendAdapter({
    defaultFromAddress: 'info@grupo-met.com',
    defaultFromName: 'Tecnocell Balvanera',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
})
