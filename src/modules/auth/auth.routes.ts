import { Router } from "express";

import { validateBody } from "../../middlewares/validate.middleware";
import { authController } from "./auth.controller";
import { validateLoginBody } from "./auth.validator";

const authRoutes = Router();

authRoutes.post("/login", validateBody(validateLoginBody), authController.login);

export { authRoutes };
