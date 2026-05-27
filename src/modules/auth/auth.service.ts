import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";

import { env } from "../../config/env";
import { AppError } from "../../lib/errors";
import { authRepository } from "./auth.repository";
import type { LoginBody, LoginResult } from "./auth.types";

export const authService = {
  async login(credentials: LoginBody): Promise<LoginResult> {
    const admin = await authRepository.findAdminByUsername(credentials.username);

    if (!admin || !admin.isActive) {
      throw new AppError(401, "Invalid username or password.");
    }

    const isValidPassword = await bcrypt.compare(credentials.password, admin.passwordHash);
    if (!isValidPassword) {
      throw new AppError(401, "Invalid username or password.");
    }

    const expiresIn: SignOptions["expiresIn"] = env.JWT_EXPIRES_IN as SignOptions["expiresIn"];
    const token = jwt.sign({ sub: admin.id, username: admin.username }, env.JWT_SECRET, {
      expiresIn,
    });

    return {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    };
  },
};
