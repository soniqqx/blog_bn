import { CommentStatus } from "@prisma/client";

export type CommentCreateInput = {
  blogId: number;
  authorName: string;
  message: string;
};

export type CommentUpdateStatusInput = {
  status: CommentStatus;
};

export type CreateCommentBody = CommentCreateInput;
export type UpdateCommentStatusBody = CommentUpdateStatusInput;