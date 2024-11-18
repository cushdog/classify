import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { Config } from '../../config';

const pool = new Pool({
  connectionString: Config.DATABASE_URL,
});

export const db = drizzle(pool);