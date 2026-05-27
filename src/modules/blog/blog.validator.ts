import type { BlogListQuery } from "./blog.types";

export const validateBlogListQuery = (query: unknown): BlogListQuery => {
  return query as BlogListQuery;
};
