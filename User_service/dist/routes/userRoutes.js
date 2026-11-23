"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const user_validator_1 = require("../validators/user.validator");
const router = express_1.default.Router();
router.post("/users", rateLimiter_1.authLimiter, (0, validate_1.validate)(user_validator_1.registerSchema), userController_1.registerUser);
router.post("/login", rateLimiter_1.authLimiter, (0, validate_1.validate)(user_validator_1.loginSchema), userController_1.loginUser);
router.get("/users", auth_1.authenticate, userController_1.getUsers);
exports.default = router;
