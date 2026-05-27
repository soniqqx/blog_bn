import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { AppError } from "../lib/errors";
import type { AuthTokenPayload } from "../modules/auth/auth.types";

const isAuthTokenPayload = (value: unknown): value is AuthTokenPayload => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const payload = value as Record<string, unknown>;
  return typeof payload.sub === "number" && typeof payload.username === "string";
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    next(new AppError(401, "Authorization header is required."));
    return;
  }

  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) {
    next(new AppError(401, "Invalid authorization format. Use Bearer token."));
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (!isAuthTokenPayload(payload)) {
      next(new AppError(401, "Invalid token payload."));
      return;
    }

    res.locals.auth = payload;
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token."));
  }
};
