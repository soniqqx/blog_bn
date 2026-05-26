import "dotenv/config";

import app from "./app";
import pool from "./config/db";

const PORT = Number(process.env.PORT) || 3000;

async function startServer(): Promise<void> {
  try {
    await pool.$connect();
    console.log("Connected to database via Prisma");
  } catch {
    console.warn("Database is not ready yet. Server will still start.");
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

void startServer();

process.on("SIGINT", async () => {
  await pool.$disconnect();
  process.exit(0);
});
