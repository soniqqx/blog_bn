import { Router } from "express";

import { commentController } from "./comment.controller";

const commentRoutes = Router();

commentRoutes.post("/", commentController.create);

export { commentRoutes };
