import { Blog } from "@prisma/client";
import { AppError } from "../../lib/errors";
import { resolvePagination } from "../../utils/pagination";
import { blogRepository } from "./blog.repository";
import { BlogListParams, BlogListQuery, BlogListResult, BlogWithImages } from "./blog.types";

export const blogService = {
  buildListParams(query: BlogListQuery, isPublished?: boolean): BlogListParams {
    return {
      pagination: resolvePagination(query.page, query.pageSize),
      search: query.search?.trim() ?? "",
      sortOrder: query.sortOrder ?? "desc",
      sortBy: query.sortBy ?? "postedAt",
      isPublished,
    };
  },

  async getPublicBlogs(query: BlogListQuery): Promise<BlogListResult> {
    return blogRepository.findBlogs(this.buildListParams(query, true));
  },
  
  async getBlogBySlug(slug: string): Promise<BlogWithImages> {
    const blog = await blogRepository.findBlogDetailBySlug(slug);
    if (!blog) {
      throw new AppError(404, "Blog not found.");
    }

    return blogRepository.incrementViewCountBySlug(slug);
  }
};
