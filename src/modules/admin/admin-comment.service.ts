import { CommentStatus } from "@prisma/client";
import { AppError } from "../../lib/errors";
import { resolvePagination } from "../../utils/pagination";
import { commentRepository } from "../comment/comment.repository";
import type { Comment } from "@prisma/client";
import type { AdminCommentListQuery, CommentListResult } from "../comment/comment.types";

export const adminCommentService = {
  async listComments(query: AdminCommentListQuery): Promise<CommentListResult> {
    const pagination = resolvePagination(query.page, query.pageSize);
    return commentRepository.findCommentsForAdmin(pagination, query.status);
  },

  async updateCommentStatus(id: number, status: CommentStatus, moderatedByAdminId: number): Promise<Comment> {
    const existing = await commentRepository.findCommentById(id);
    if (!existing) {
      throw new AppError(404, "Comment not found.");
    }

    if (existing.status !== CommentStatus.PENDING) {
      throw new AppError(409, "Only pending comments can be moderated.");
    }

    return commentRepository.updateCommentStatus(id, status, moderatedByAdminId);
  }
};
