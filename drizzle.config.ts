import type { Config } from 'drizzle-kit'

export default {
  schema: './db/schemas/index.ts',
  out: './db/migrations',
  driver: 'mysql2',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || 'mysql://user:password@localhost:3306/duck_studio',
  },
} satisfies Config
