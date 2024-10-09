import { defineConfig } from 'drizzle-kit';

import { Config } from './config';

export default defineConfig({
  schema: 'src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: Config.DATABASE_URL
  },
  verbose: true,
  strict: true
});