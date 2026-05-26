import cors from "cors";
import express from "express";

import postRoutes from "./routes/postRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/posts", postRoutes);

export default app;
