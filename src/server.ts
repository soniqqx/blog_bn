import "dotenv/config";

import app from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { prisma } from "./lib/prisma";

const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info("Connected to database via Prisma.");
  } catch (error) {
    logger.warn("Database is not ready yet. Server will still start.", error);
  }

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on http://localhost:${env.PORT}`);
  });

  const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
    logger.info(`Received ${signal}, shutting down.`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });
  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
};

void startServer();
