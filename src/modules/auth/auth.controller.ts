import type { NextFunction, Request, Response } from "express";

import { sendSuccess } from "../../lib/response";
import type { LoginBody } from "./auth.types";
import { authService } from "./auth.service";

export const authController = {
  async login(req: Request<unknown, unknown, LoginBody>, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      sendSuccess(res, 200, "Login success.", result);
    } catch (error) {
      next(error);
    }
  },
};
