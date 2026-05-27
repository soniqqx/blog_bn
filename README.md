# Simple Blog Backend (TypeScript + Prisma)

Starter backend project for a simple blog system using Express, TypeScript, Prisma, and MySQL.

## Stack

- Node.js + Express + TypeScript
- Prisma ORM
- MySQL (Docker Compose)

## Quick Start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment file:

   ```bash
   copy .env.example .env
   ```

3. Start MySQL:

   ```bash
   docker compose up -d
   ```

4. Generate Prisma Client and sync schema:

   ```bash
   npm run prisma:generate
   npm run prisma:push
   npm run prisma:seed
   ```

5. Run API server:

   ```bash
   npm run dev
   ```

## Project structure

```text
src/
  app.ts
  server.ts
  config/
    env.ts
    logger.ts
  lib/
    prisma.ts
    errors.ts
    response.ts
  middlewares/
    auth.middleware.ts
    error.middleware.ts
    validate.middleware.ts
    rate-limit.middleware.ts
  modules/
    auth/
      auth.controller.ts
      auth.service.ts
      auth.repository.ts
      auth.validator.ts
      auth.routes.ts
      auth.types.ts
    blog/
      blog.controller.ts
      blog.service.ts
      blog.repository.ts
      blog.validator.ts
      blog.routes.ts
      blog.types.ts
    comment/
      comment.controller.ts
      comment.service.ts
      comment.repository.ts
      comment.validator.ts
      comment.routes.ts
      comment.types.ts
    admin/
      admin-blog.controller.ts
      admin-blog.service.ts
      admin-comment.controller.ts
      admin-comment.service.ts
      admin.routes.ts
  routes/
    index.ts
prisma/
  schema.prisma
  migrations/
  seed.ts
tests/
  integration/
  unit/
```

## Build for production

```bash
npm run build
npm start
```

## Prisma scripts

- `npm run prisma:generate`
- `npm run prisma:push`
- `npm run prisma:migrate`
- `npm run prisma:seed`

## Endpoints

- `GET /health`
- `POST /api/auth/login` (functional)
- `GET /api/blogs` (scaffold, returns `501`)
- `POST /api/comments` (scaffold, returns `501`)
- `GET /api/admin/blogs` (scaffold, returns `501`)
- `GET /api/admin/comments` (scaffold, returns `501`)

## Login request example

```json
{
  "username": "admin",
  "password": "your-password"
}
```
