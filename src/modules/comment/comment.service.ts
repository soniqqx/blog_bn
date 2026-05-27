import { CommentStatus } from "@prisma/client";
import { AppError } from "../../lib/errors";
import { resolvePagination } from "../../utils/pagination";
import { commentRepository } from "./comment.repository";
import { CommentCreateInput, CommentListQuery, type CommentListResult } from "./comment.types";
import type { Comment } from "@prisma/client";

export const commentService = {
  async createComment(input: CommentCreateInput): Promise<Comment> {
    const blog = await commentRepository.findBlogById(input.blogId);
    if (!blog || !blog.isPublished) {
      throw new AppError(404, "Blog not found.");
    }

    const inputData = {
      ...input,
      status: CommentStatus.PENDING,
    };
    const comment = await commentRepository.createComment(inputData);
    return comment;
  },

  async getApprovedCommentsByBlogSlug(slug: string, query: CommentListQuery): Promise<CommentListResult> {
    const blog = await commentRepository.findPublishedBlogBySlug(slug);
    if (!blog) {
      throw new AppError(404, "Blog not found.");
    }

    const pagination = resolvePagination(query.page, query.pageSize);
    return commentRepository.findCommentsByBlogId(blog.id, pagination, CommentStatus.APPROVED);
  },
};
