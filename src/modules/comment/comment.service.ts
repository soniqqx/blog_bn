import { CommentStatus } from "@prisma/client";
import { AppError } from "../../lib/errors";
import { commentRepository } from "./comment.repository";
import { CommentCreateInput } from "./comment.types";
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
};
