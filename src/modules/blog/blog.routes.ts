import { Router } from "express";

import { validateQuery } from "../../middlewares/validate.middleware";
import { blogController } from "./blog.controller";
import { validateBlogListQuery } from "./blog.validator";

const blogRoutes = Router();

blogRoutes.get("/", validateQuery(validateBlogListQuery), blogController.list);
blogRoutes.get("/:slug", blogController.getBySlug);

export { blogRoutes };
