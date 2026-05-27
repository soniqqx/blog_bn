import type { CreateCommentBody } from "./comment.types";

export const validateCreateCommentBody = (body: unknown): CreateCommentBody => {
  return body as CreateCommentBody;
};
