import { Router } from "express";

import { validateBody } from "../../middlewares/validate.middleware";
import { commentController } from "./comment.controller";
import { validateCreateCommentBody } from "./comment.validator";

const commentRoutes = Router();

commentRoutes.post("/", validateBody(validateCreateCommentBody), commentController.create);

export { commentRoutes };
