import type { NextFunction, Request, Response } from "express";

import { adminBlogService } from "./admin-blog.service";
import { AppError } from "../../lib/errors";
import { sendSuccess } from "../../lib/response";
import { AdminBlogListQuery, BlogUpdateInput } from "../blog/blog.types";

export const adminBlogController = {
  async list(req: Request<unknown, unknown, unknown, AdminBlogListQuery>, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = (res.locals.validatedQuery as AdminBlogListQuery) ?? req.query;
      const result = await adminBlogService.getBlogs(query);
      sendSuccess(res, 200, "Blogs fetched successfully.", result);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        throw new AppError(400, "id must be a positive integer.");
      }

      const result = await adminBlogService.updateBlog(id, req.body as BlogUpdateInput);
      sendSuccess(res, 200, "Blog updated successfully.", result);
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        throw new AppError(400, "id must be a positive integer.");
      }

      const isPublished = Boolean((req.body as { isPublished: boolean }).isPublished);
      const result = await adminBlogService.updateBlogStatus(id, isPublished);
      sendSuccess(
        res,
        200,
        isPublished ? "Blog published successfully." : "Blog unpublished successfully.",
        result,
      );
    } catch (error) {
      next(error);
    }
  },
};