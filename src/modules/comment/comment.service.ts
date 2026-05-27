import { AppError } from "../../lib/errors";

export const commentService = {
  createComment(): never {
    throw new AppError(501, "Comment module is scaffolded only.");
  },
};
