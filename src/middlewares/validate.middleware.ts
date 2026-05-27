import type { NextFunction, Request, Response } from "express";

export type Validator<TBody> = (body: unknown) => TBody;

export const validateBody =
  <TBody>(validator: Validator<TBody>) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    req.body = validator(req.body);
    next();
  };

export const validateQuery =
  <TQuery>(validator: Validator<TQuery>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    res.locals.validatedQuery = validator(req.query);
    next();
  };
