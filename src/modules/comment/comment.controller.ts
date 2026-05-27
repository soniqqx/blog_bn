import type { NextFunction, Request, Response } from "express";

import { commentService } from "./comment.service";

export const commentController = {
  create(_req: Request, _res: Response, next: NextFunction): void {
    try {
      commentService.createComment();
    } catch (error) {
      next(error);
    }
  },
};
