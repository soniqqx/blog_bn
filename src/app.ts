import cors from "cors";
import express from "express";

import { errorMiddleware } from "./middlewares/error.middleware";
import { rateLimitMiddleware } from "./middlewares/rate-limit.middleware";
import { apiRoutes } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimitMiddleware);

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "ok" });
});

app.use("/api", apiRoutes);
app.use(errorMiddleware);

export default app;
