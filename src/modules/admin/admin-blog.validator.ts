import type { AdminBlogListQuery } from "../blog/blog.types";
import { validateBlogListQuery } from "../blog/blog.validator";
import { AppError } from "../../lib/errors";

export const validateAdminBlogListQuery = (query: unknown): AdminBlogListQuery => {
  const base = validateBlogListQuery(query);
  const raw = query as Record<string, unknown>;

  let isPublished: AdminBlogListQuery["isPublished"];
  if (raw.isPublished !== undefined) {
    if (raw.isPublished !== "true" && raw.isPublished !== "false") {
      throw new AppError(400, "isPublished must be true or false.");
    }
    isPublished = raw.isPublished;
  }

  return {
    ...base,
    isPublished,
  };
};
