import { Blog, BlogImage, Comment } from "@prisma/client";
import { AppError } from "../../lib/errors";
import { resolvePagination } from "../../utils/pagination";
import { blogRepository } from "./blog.repository";
import { BlogListParams, BlogListQuery, BlogListResult, BlogUpdateInput } from "./blog.types";

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
  
  async getBlogBySlug(slug: string): Promise<(Blog & { images: BlogImage[]; comments: Comment[] }) | null> {
    return blogRepository.findBlogBySlug(slug);
  },

  async updateBlog(id: number, data: BlogUpdateInput): Promise<Blog> {
    return blogRepository.updateBlog(id, data);
  },

  async updateBlogStatus(id: number, status: boolean): Promise<Blog> {
    const existing = await blogRepository.findBlogById(id);
    if (!existing) {
      throw new AppError(404, "Blog not found.");
    }

    const postedAt = status
      ? existing.postedAt ?? new Date()
      : existing.postedAt;

    return blogRepository.updateBlogStatus(id, status, postedAt);
  },

};
