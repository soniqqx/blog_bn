import { AppError } from "../../lib/errors";
import { CommentStatus } from "@prisma/client";
import { AdminCommentListQuery, CommentUpdateStatusInput } from "../comment/comment.types";

export const validateAdminUpdateCommentStatusBody = (body: unknown): CommentUpdateStatusInput => {
  if (typeof body !== "object" || body === null) {
    throw new AppError(400, "Request body must be an object.");
  }
  const { status } = body as Record<string, unknown>;

  if (status !== CommentStatus.APPROVED && status !== CommentStatus.REJECTED) {
    throw new AppError(400, "status must be APPROVED or REJECTED.");
  }

  return {
    status: status as CommentStatus,
  };
};

export const validateAdminCommentListQuery = (query: unknown): AdminCommentListQuery => {
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

  let status: CommentStatus | undefined;
  if (raw.status !== undefined) {
    if (
      raw.status !== CommentStatus.PENDING &&
      raw.status !== CommentStatus.APPROVED &&
      raw.status !== CommentStatus.REJECTED
    ) {
      throw new AppError(400, "status must be PENDING, APPROVED, or REJECTED.");
    }
    status = raw.status;
  }

  return {
    page: parseOptionalPositiveInt(raw.page, "page"),
    pageSize: parseOptionalPositiveInt(raw.pageSize, "pageSize"),
    status,
  };
};
