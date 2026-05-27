import { Comment, CommentStatus } from "@prisma/client";
import { PaginatedResult } from "../../utils/pagination";

export type CommentCreateInput = {
  blogId: number;
  authorName: string;
  message: string;
};

export type CommentUpdateStatusInput = {
  status: CommentStatus;
};

export type CommentListQuery = {
  page?: number | string;
  pageSize?: number | string;
};

export type AdminCommentListQuery = CommentListQuery & {
  status?: CommentStatus;
};

export type CommentListResult = PaginatedResult<Comment>;

export type CreateCommentBody = CommentCreateInput;
export type UpdateCommentStatusBody = CommentUpdateStatusInput;