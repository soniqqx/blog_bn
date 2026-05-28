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
import {
  validateAdminCommentListQuery,
  validateAdminUpdateCommentStatusBody,
} from "./admin-comment.validator";

const adminRoutes = Router();

adminRoutes.use(authMiddleware);
adminRoutes.get("/blogs", validateQuery(validateAdminBlogListQuery), adminBlogController.list);
adminRoutes.get("/blogs/:slug", adminBlogController.getBlogBySlug);
adminRoutes.put("/blogs/:id", validateBody(validateAdminUpdateBlogBody), adminBlogController.update);
adminRoutes.patch("/blogs/:id/status", validateBody(validateAdminUpdateBlogStatusBody), adminBlogController.updateStatus);
adminRoutes.get("/comments", validateQuery(validateAdminCommentListQuery), adminCommentController.list);
adminRoutes.patch("/comments/:id/status", validateBody(validateAdminUpdateCommentStatusBody), adminCommentController.updateStatus);

export { adminRoutes };
