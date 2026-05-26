import { Router } from "express";
import prisma from "../config/db";

const router = Router();

router.get("/", async (_req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json({
    message: "Simple blog API is ready",
    data: posts,
  });
});

export default router;
