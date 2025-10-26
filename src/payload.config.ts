import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { plugins } from './plugins'
import { getServerSideURL } from './utilities/getURL'
import { Navbar } from './blocks/NavBar'
import Footer from './blocks/Footer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { BlogPage } from './collections/BlogPage/BlogPage'
import { FormSubmissions } from './collections/FormSubmissions'
import { JobApplications } from './collections/JobApplications'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      collections: ['pages'],
      url: ({ data, locale }) => {
        const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000'
        if (!data) {
          console.warn('Live preview called with empty data!')
          return `${frontendURL}/`
        }

        const loc = locale?.code || 'en'
        let slug = '/'
        if (typeof data.slug === 'string') slug = data.slug
        else if (typeof data.slug === 'object') slug = String(data.slug?.[loc] || '/')

        if (!slug || slug === '') slug = '/'

        const draftURL = new URL(
          `/api/draft?url=${encodeURIComponent(`/${loc}/${slug}`)}&secret=${process.env.DRAFT_SECRET || ''}`,
          frontendURL,
        )

        console.log('Live Preview URL generated:', draftURL.toString())
        return draftURL.toString()
      },
    },
  },
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  collections: [Pages, Posts, Media, Users, FormSubmissions, JobApplications],
  localization: {
    locales: [
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'Arabic',
        code: 'ar',
        rtl: true,
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Navbar, Footer, BlogPage],
  plugins: [...plugins],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
