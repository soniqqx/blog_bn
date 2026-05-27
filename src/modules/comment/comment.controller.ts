import type { NextFunction, Request, Response } from "express";

import { commentService } from "./comment.service";
import { sendSuccess } from "../../lib/response";
import { CommentCreateInput } from "./comment.types";

export const commentController = {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const comment = await commentService.createComment(req.body as CommentCreateInput);
      sendSuccess(res, 201, "Comment created successfully.", comment);
    } catch (error) {
      next(error);
    }
  },
};
