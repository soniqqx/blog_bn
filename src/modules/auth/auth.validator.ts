import { AppError } from "../../lib/errors";
import type { LoginBody } from "./auth.types";

export const validateLoginBody = (body: unknown): LoginBody => {
  if (typeof body !== "object" || body === null) {
    throw new AppError(400, "Request body must be an object.");
  }

  const { username, password } = body as Record<string, unknown>;

  if (typeof username !== "string" || username.trim() === "") {
    throw new AppError(400, "username is required.");
  }

  if (typeof password !== "string" || password.trim() === "") {
    throw new AppError(400, "password is required.");
  }

  return {
    username: username.trim(),
    password,
  };
};
