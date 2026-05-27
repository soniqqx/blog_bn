import { Blog, BlogImage, Comment, Prisma } from "@prisma/client";
import { blogRepository } from "./blog.repository";
import { BlogListQuery, BlogListResult, BlogUpdateInput } from "./blog.types";

export const blogService = {
  async getPublicBlogs(query?: BlogListQuery): Promise<BlogListResult> {
    return blogRepository.findAllBlogs(query ?? {
      page: 1,
      pageSize: 10,
      search: "",
      sortOrder: "desc",
      sortBy: "createdAt",
    });
  },
  
  async getBlogBySlug(slug: string): Promise<(Blog & { images: BlogImage[]; comments: Comment[] }) | null> {
    return blogRepository.findBlogBySlug(slug);
  },

};
