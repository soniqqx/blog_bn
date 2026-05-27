import type { NextFunction, Request, Response } from "express";

import { commentService } from "./comment.service";
import { sendSuccess } from "../../lib/response";
import { CommentCreateInput, CommentListQuery } from "./comment.types";

export const commentController = {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const comment = await commentService.createComment(req.body as CommentCreateInput);
      sendSuccess(res, 201, "Comment created successfully.", comment);
    } catch (error) {
      next(error);
    }
  },

  async getByBlogSlug(
    req: Request<{ slug: string }, unknown, unknown, CommentListQuery>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const query = (res.locals.validatedQuery as CommentListQuery) ?? req.query;
      const result = await commentService.getApprovedCommentsByBlogSlug(req.params.slug, query);
      sendSuccess(res, 200, "Comments fetched successfully.", result);
    } catch (error) {
      next(error);
    }
  },
};
