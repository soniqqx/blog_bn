import { prisma } from "../../lib/prisma";
import { CommentCreateInput } from "./comment.types";
import type { Comment } from "@prisma/client";

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
};
