import type { BlogListQuery } from "./blog.types";
import { AppError } from "../../lib/errors";

export const validateBlogListQuery = (query: unknown): BlogListQuery => {
  if (typeof query !== "object" || query === null) {
    throw new AppError(400, "Query params must be an object.");
  }

  const raw = query as Record<string, unknown>;

  const parseOptionalPositiveInt = (value: unknown, key: string): number | undefined => {
    if (value === undefined) {
      return undefined;
    }

    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new AppError(400, `${key} must be a positive integer.`);
    }

    return parsed;
  };

  const page = parseOptionalPositiveInt(raw.page, "page");
  const pageSize = parseOptionalPositiveInt(raw.pageSize, "pageSize");

  let sortOrder: BlogListQuery["sortOrder"];
  if (raw.sortOrder !== undefined) {
    if (raw.sortOrder !== "asc" && raw.sortOrder !== "desc") {
      throw new AppError(400, "sortOrder must be asc or desc.");
    }
    sortOrder = raw.sortOrder;
  }

  let sortBy: BlogListQuery["sortBy"];
  if (raw.sortBy !== undefined) {
    const allowedSortBy = new Set(["createdAt", "updatedAt", "postedAt", "viewCount"]);
    if (typeof raw.sortBy !== "string" || !allowedSortBy.has(raw.sortBy)) {
      throw new AppError(400, "sortBy is invalid.");
    }
    sortBy = raw.sortBy as BlogListQuery["sortBy"];
  }

  return {
    page,
    pageSize,
    search: typeof raw.search === "string" ? raw.search.trim() : undefined,
    sortOrder,
    sortBy,
  };
};
