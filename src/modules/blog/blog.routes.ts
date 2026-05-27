import { Router } from "express";

import { blogController } from "./blog.controller";

const blogRoutes = Router();

blogRoutes.get("/", blogController.list);
blogRoutes.get("/:slug", blogController.getBySlug);

export { blogRoutes };
