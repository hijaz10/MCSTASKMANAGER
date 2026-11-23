"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const email = zod_1.z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .max(254);
exports.registerSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters"),
    email,
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(72, "Password must be at most 72 characters"),
});
exports.loginSchema = zod_1.z.object({
    email,
    password: zod_1.z.string().min(1, "Password is required").max(72),
});
