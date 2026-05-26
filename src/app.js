const express = require("express");
const cors = require("cors");

const postRoutes = require("./routes/postRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/posts", postRoutes);

module.exports = app;
