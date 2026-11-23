import express, { Router } from "express";
import {
  registerUser,
  loginUser,
  getUsers,
} from "../controllers/userController";
import { validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/auth";
import { authLimiter } from "../middlewares/rateLimiter";
import { registerSchema, loginSchema } from "../validators/user.validator";

const router: Router = express.Router();

router.post("/users", authLimiter, validate(registerSchema), registerUser);

router.post("/login", authLimiter, validate(loginSchema), loginUser);

router.get("/users", authenticate, getUsers);

export default router;
