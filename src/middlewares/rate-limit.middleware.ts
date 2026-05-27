import type { NextFunction, Request, Response } from "express";

import { AppError } from "../lib/errors";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 100;
const hits = new Map<string, { count: number; startAt: number }>();

export const rateLimitMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const key = req.ip ?? "unknown";
  const now = Date.now();
  const current = hits.get(key);

  if (!current || now - current.startAt > WINDOW_MS) {
    hits.set(key, { count: 1, startAt: now });
    next();
    return;
  }

  if (current.count >= MAX_REQUESTS) {
    next(new AppError(429, "Too many requests. Please try again later."));
    return;
  }

  current.count += 1;
  hits.set(key, current);
  next();
};
