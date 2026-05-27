import { Blog } from "@prisma/client";
import { blogRepository } from "../blog/blog.repository";
import type { BlogListResult, BlogUpdateInput } from "../blog/blog.types";

export const adminBlogService = {
  async listDrafts(): Promise<BlogListResult> {
    return blogRepository.findAllBlogs({
      page: 1,
      pageSize: 10,
      search: "",
      sortOrder: "desc",
      sortBy: "createdAt",
    });
  },

  async updateBlog(id: number, data: BlogUpdateInput): Promise<Blog> {
    return blogRepository.updateBlog(id, data);
  },

  async updateBlogStatus(id: number, status: boolean): Promise<Blog> {
    return blogRepository.updateBlogStatus(id, status);
  },
  
};
