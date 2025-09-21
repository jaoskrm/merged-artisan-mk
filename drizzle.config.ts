import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: 'hopper.proxy.rlwy.net',
    port: 27955,
    user: 'postgres',
    password: 'sexXMKgqbaqXYHrwrVOzVZXgsucHpjvu',
    database: 'railway',
    ssl: { rejectUnauthorized: false },
  },
} satisfies Config;
