import { Router } from "express";

import { validateBody, validateQuery } from "../../middlewares/validate.middleware";
import { commentController } from "./comment.controller";
import { validateCommentListQuery, validateCreateCommentBody } from "./comment.validator";

const commentRoutes = Router();

commentRoutes.get("/blogs/:slug", validateQuery(validateCommentListQuery), commentController.getByBlogSlug);
commentRoutes.post("/", validateBody(validateCreateCommentBody), commentController.create);

export { commentRoutes };
