import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { validateQuery } from "../../middlewares/validate.middleware";
import { adminBlogController } from "./admin-blog.controller";
import { adminCommentController } from "./admin-comment.controller";
import { validateAdminBlogListQuery } from "./admin-blog.validator";

const adminRoutes = Router();

adminRoutes.use(authMiddleware);
adminRoutes.get("/blogs", validateQuery(validateAdminBlogListQuery), adminBlogController.list);
adminRoutes.put("/blogs/:id", adminBlogController.update);
adminRoutes.patch("/blogs/:id/status", adminBlogController.updateStatus);
adminRoutes.get("/comments", adminCommentController.list);

export { adminRoutes };
