import { prisma } from "../../lib/prisma";
import { CommentCreateInput } from "./comment.types";
import type { Comment, CommentStatus } from "@prisma/client";

export const commentRepository = {
  createComment(input: CommentCreateInput): Promise<Comment> {
    return prisma.comment.create({
      data: input,
    });
  },

  findBlogById(blogId: number): Promise<{ id: number; isPublished: boolean } | null> {
    return prisma.blog.findUnique({
      where: { id: blogId },
      select: { id: true, isPublished: true },
    });
  },

  updateCommentStatus(id: number, status: CommentStatus, moderatedByAdminId?: number): Promise<Comment> {
    return prisma.comment.update({
      where: { id },
      data: {
        status,
        moderatedByAdminId,
        moderatedAt: new Date(),
      },
    });
  },

  findCommentById(id: number): Promise<Comment | null> {
    return prisma.comment.findUnique({
      where: { id },
    });
  },
};
