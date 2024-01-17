import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  driver: 'pg', // | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  dbCredentials: {
    host: process.env.HOST || "127.0.0.1",
    user: process.env.USER || "admin",
    password: process.env.PASSOWRD || "password",
    database: process.env.DATABASE || "dbms",
  },
} satisfies Config;