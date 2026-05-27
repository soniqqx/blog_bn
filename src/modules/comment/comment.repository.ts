import { prisma } from "../../lib/prisma";
import { CommentCreateInput } from "./comment.types";
import type { Comment, CommentStatus } from "@prisma/client";
import { buildPaginatedResult, buildPagination, type PaginationParams } from "../../utils/pagination";
import type { CommentListResult } from "./comment.types";

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

  findPublishedBlogBySlug(slug: string): Promise<{ id: number } | null> {
    return prisma.blog.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      select: { id: true },
    });
  },

  async findCommentsByBlogId(
    blogId: number,
    params: PaginationParams,
    status?: CommentStatus,
  ): Promise<CommentListResult> {
    const { skip, take } = buildPagination(params);
    const where = status ? { blogId, status } : { blogId };

    const [items, totalItems] = await Promise.all([
      prisma.comment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.comment.count({ where }),
    ]);

    return buildPaginatedResult(items, totalItems, params);
  },

  async findCommentsForAdmin(params: PaginationParams, status?: CommentStatus): Promise<CommentListResult> {
    const { skip, take } = buildPagination(params);
    const where = status ? { status } : {};

    const [items, totalItems] = await Promise.all([
      prisma.comment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.comment.count({ where }),
    ]);

    return buildPaginatedResult(items, totalItems, params);
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
