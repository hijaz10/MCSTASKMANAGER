import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { AuthPayload } from "../types/user.types";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, config.jwtSecret) as AuthPayload;
    res.locals.user = payload;
    next();
  } catch (error: unknown) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
