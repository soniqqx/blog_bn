import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { validateBody, validateQuery } from "../../middlewares/validate.middleware";
import { adminBlogController } from "./admin-blog.controller";
import { adminCommentController } from "./admin-comment.controller";
import {
  validateAdminBlogListQuery,
  validateAdminUpdateBlogBody,
  validateAdminUpdateBlogStatusBody,
} from "./admin-blog.validator";

const adminRoutes = Router();

adminRoutes.use(authMiddleware);
adminRoutes.get("/blogs", validateQuery(validateAdminBlogListQuery), adminBlogController.list);
adminRoutes.put("/blogs/:id", validateBody(validateAdminUpdateBlogBody), adminBlogController.update);
adminRoutes.patch("/blogs/:id/status", validateBody(validateAdminUpdateBlogStatusBody), adminBlogController.updateStatus);
adminRoutes.get("/comments", adminCommentController.list);

export { adminRoutes };
