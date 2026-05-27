import type { NextFunction, Request, Response } from "express";

import { adminCommentService } from "./admin-comment.service";
import { AppError } from "../../lib/errors";
import { sendSuccess } from "../../lib/response";
import type { AuthTokenPayload } from "../auth/auth.types";

export const adminCommentController = {
  list(_req: Request, _res: Response, next: NextFunction): void {
    try {
      adminCommentService.listPending();
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if(!Number.isInteger(id) || id <= 0) {
        throw new AppError(400, "id must be a positive integer.");
      }

      const auth = res.locals.auth as AuthTokenPayload | undefined;
      if (!auth) {
        throw new AppError(401, "Unauthorized.");
      }

      const result = await adminCommentService.updateCommentStatus(id, req.body.status, auth.sub);
      sendSuccess(res, 200, "Comment status updated successfully.", result);
    }catch (error) {
      next(error)
    }
  }
};
