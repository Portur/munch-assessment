# Typescript, Nodejs, Express, Postgres server.

- ExpressJs
- Jest
- Prisma
- Postgres
- Swagger AutoGen

## Main

- http://localhost:4000/ -> api-docs

## Setup

### Docker `postgres:latest`

- Postgres 17 :
    - Main: deployed / local
    - Shadow: Prisma migration validation
    - Test: e2e Testing

### Install

`npm install`

### Environment Variables Example

```
SERVER_PORT=4000

JWT_SECRET=xx

DATABASE_URL=postgresql://postgres:password@localhost:5432/munch?schema=public&application_name=your_local_connection_name&connection_limit=1
SHADOW_DATABASE_URL=postgresql://postgres:password@localhost:5433/munch?schema=public&application_name=your_local_connection_name&connection_limit=1
```

### Test Environment Variables Example

```
JWT_SECRET=test

DATABASE_URL=postgresql://postgres:password@localhost:5434/munch?schema=public&application_name=your_local_connection_name&connection_limit=1
```

### DB init

###### /TODO - add to docker script(s) and lunch setup

```sql 
CREATE
DATABASE munch;
```

## Run

`npm run dev`

## Test

`npm run test`

## Database migration

After updating db Model run
`npm run prisma:migrate:dev`
`npm run prisma:generate` 

