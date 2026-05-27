import { Router } from "express";

import { adminRoutes } from "../modules/admin/admin.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { blogRoutes } from "../modules/blog/blog.routes";
import { commentRoutes } from "../modules/comment/comment.routes";

const apiRoutes = Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/blogs", blogRoutes);
apiRoutes.use("/comments", commentRoutes);
apiRoutes.use("/admin", adminRoutes);

export { apiRoutes };
