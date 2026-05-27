import type { Admin } from "@prisma/client";

import { prisma } from "../../lib/prisma";

export const authRepository = {
  findAdminByUsername(username: string): Promise<Admin | null> {
    return prisma.admin.findUnique({
      where: { username },
    });
  },
};
