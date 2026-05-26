# Simple Blog Backend (TypeScript Starter)

Starter backend project for a simple blog system using Express, TypeScript, and MySQL.

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
   ```

5. Run API server:

   ```bash
   npm run dev
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

## Endpoints

- `GET /health`
- `GET /api/posts`
