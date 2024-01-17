"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    schema: './db/schema.ts',
    out: './drizzle',
    driver: 'pg', // | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
    dbCredentials: {
        host: "127.0.0.1",
        user: "admin",
        password: "password",
        database: "dbms",
    },
};
