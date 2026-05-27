export type CommentCreateInput = {
  blogId: number;
  authorName: string;
  message: string;
};

export type CreateCommentBody = CommentCreateInput;
