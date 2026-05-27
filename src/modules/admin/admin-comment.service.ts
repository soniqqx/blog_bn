import { CommentStatus } from "@prisma/client";
import { AppError } from "../../lib/errors";
import { commentRepository } from "../comment/comment.repository";
import type { Comment } from "@prisma/client";

export const adminCommentService = {
  listPending(): never {
    throw new AppError(501, "Admin comment module is scaffolded only.");
    
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
