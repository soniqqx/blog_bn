import type { NextFunction, Request, Response } from "express";

import { adminCommentService } from "./admin-comment.service";

export const adminCommentController = {
  list(_req: Request, _res: Response, next: NextFunction): void {
    try {
      adminCommentService.listPending();
    } catch (error) {
      next(error);
    }
  },
};
