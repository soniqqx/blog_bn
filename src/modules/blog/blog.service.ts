import { Blog, BlogImage, Comment } from "@prisma/client";
import { resolvePagination } from "../../utils/pagination";
import { blogRepository } from "./blog.repository";
import { BlogListParams, BlogListQuery, BlogListResult } from "./blog.types";

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
    return blogRepository.findBlogDetailBySlug(slug);
  }
};
