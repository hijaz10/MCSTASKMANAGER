import { SignOptions } from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is required");
}

export const config = {
  jwtSecret,
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN ||
    "15m") as SignOptions["expiresIn"],
};
