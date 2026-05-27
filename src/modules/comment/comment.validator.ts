import type { CommentListQuery, CreateCommentBody } from "./comment.types";
import { AppError } from "../../lib/errors";

export const validateCreateCommentBody = (body: unknown): CreateCommentBody => {
  if (typeof body !== "object" || body === null) {
    throw new AppError(400, "Request body must be an object.");
  }

  const raw = body as Record<string, unknown>;
  const blogId = Number(raw.blogId);
  if (!Number.isInteger(blogId) || blogId <= 0) {
    throw new AppError(400, "blogId must be a positive integer.");
  }

  if (typeof raw.authorName !== "string" || raw.authorName.trim() === "") {
    throw new AppError(400, "authorName is required.");
  }

  if (typeof raw.message !== "string" || raw.message.trim() === "") {
    throw new AppError(400, "message is required.");
  }

  const authorName = raw.authorName.trim();
  const message = raw.message.trim();

  // Allow only Thai characters, Arabic digits, and spaces.
  const thaiAndNumberPattern = /^[ก-๙0-9\s]+$/;
  // if (!thaiAndNumberPattern.test(authorName)) {
  //   throw new AppError(400, "authorName must contain only Thai characters and numbers.");
  // }

  if (!thaiAndNumberPattern.test(message)) {
    throw new AppError(400, "message must contain only Thai characters and numbers.");
  }

  if (authorName.length > 120) {
    throw new AppError(400, "authorName must be at most 120 characters.");
  }

  if (message.length > 1000) {
    throw new AppError(400, "message must be at most 1000 characters.");
  }

  return {
    blogId,
    authorName,
    message,
  };
};

export const validateCommentListQuery = (query: unknown): CommentListQuery => {
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

  return {
    page: parseOptionalPositiveInt(raw.page, "page"),
    pageSize: parseOptionalPositiveInt(raw.pageSize, "pageSize"),
  };
};
