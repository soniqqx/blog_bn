import type { NextFunction, Request, Response } from "express";

import { blogService } from "./blog.service";
import { sendSuccess } from "../../lib/response";
import { BlogListQuery } from "./blog.types";

export const blogController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await blogService.getPublicBlogs(req.query as BlogListQuery);
      sendSuccess(res, 200, "Blogs fetched successfully.", result);
    } catch (error) {
      next(error);
    }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await blogService.getBlogBySlug(String(req.params.slug));
      sendSuccess(res, 200, "Blog fetched successfully.", result);
    } catch (error) {
      next(error);
    }
  }
};
