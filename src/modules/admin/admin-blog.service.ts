import { Blog } from "@prisma/client";
import { AppError } from "../../lib/errors";
import { blogRepository } from "../blog/blog.repository";
import { blogService } from "../blog/blog.service";
import type { AdminBlogListQuery, BlogListResult, BlogUpdateInput } from "../blog/blog.types";

export const adminBlogService = {
  async getBlogs(query: AdminBlogListQuery): Promise<BlogListResult> {
    const isPublished =
      query.isPublished === "true"
        ? true
        : query.isPublished === "false"
        ? false
        : undefined;

    return blogRepository.findBlogs(blogService.buildListParams(query, isPublished));
  },

  async updateBlog(id: number, data: BlogUpdateInput): Promise<Blog> {
    return blogService.updateBlog(id, data);
  },

  async updateBlogStatus(id: number, status: boolean): Promise<Blog> {
    if (typeof status !== "boolean") {
      throw new AppError(400, "isPublished must be boolean.");
    }

    return blogService.updateBlogStatus(id, status);
  },
  
};
