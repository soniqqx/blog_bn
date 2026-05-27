import type { NextFunction, Request, Response } from "express";

import { adminBlogService } from "./admin-blog.service";
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
      const result = await adminBlogService.updateBlog(Number(req.params.id), req.body as BlogUpdateInput);
      sendSuccess(res, 200, "Blog updated successfully.", result);
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await adminBlogService.updateBlogStatus(Number(req.params.id), req.body.isPublished as boolean);
      sendSuccess(res, 200, result ? "Blog published successfully." : "Blog unpublished successfully.", result);
    } catch (error) {
      next(error);
    }
  },
};