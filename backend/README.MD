# DMBS-Backend

## Initial setup
Initially run
```sh
npm install
```
to install all the required packages.
## Database

This project uses Drizzle to manage the database and migrations

### Configuration

To change the default database configuration values you can edit `drizzle.config.ts` or adjust the appropriate environment variables.

### Generation
To generate new migrations after changing the schema run:
```sh
pnpm drizzle-kit generate:pq
```
### Migrating
To migrate/setup the database for the first time run:
```sh
pnpm drizzle-kit push:pq
```

## Start backend
To run the backend simply run

```sh
npm run start
```
this command will build the typescript project and start run a node.js instance