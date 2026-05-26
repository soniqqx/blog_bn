# Simple Blog Backend (First Commit)

Starter backend project for a simple blog system using Express and MySQL.

## Stack

- Node.js + Express
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

4. Run API server:

   ```bash
   npm run dev
   ```

## Endpoints

- `GET /health`
- `GET /api/posts`
