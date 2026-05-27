import { AppError } from "../../lib/errors";

export const adminCommentService = {
  listPending(): never {
    throw new AppError(501, "Admin comment module is scaffolded only.");
    
  },
};
