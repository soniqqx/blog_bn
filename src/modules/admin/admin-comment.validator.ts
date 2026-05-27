import { AppError } from "../../lib/errors";
import { CommentStatus } from "@prisma/client";
import { CommentUpdateStatusInput } from "../comment/comment.types";

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
