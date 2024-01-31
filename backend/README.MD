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
npx drizzle-kit generate:pg
```
### Migrating
To migrate/setup the database for the first time run:
```sh
npx drizzle-kit push:pg
```

## Start backend
To run the backend simply run

```sh
npm run start
```
this command will build the typescript project and start run a node.js instance

## IMPORTANT
This backend currently doesn't have any sort of authentication built in.
ANYONE can DELETE/CREATE/POST ANYTHING