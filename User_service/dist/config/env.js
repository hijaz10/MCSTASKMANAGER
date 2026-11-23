"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is required");
}
exports.config = {
    jwtSecret,
    jwtExpiresIn: (process.env.JWT_EXPIRES_IN ||
        "15m"),
};
