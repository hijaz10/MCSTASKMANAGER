"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const env_1 = require("../config/env");
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(409).json({ error: "Email already registered" });
            return;
        }
        const hashedpass = await bcrypt_1.default.hash(password, 10);
        const user = new User_1.default({ name, email, password: hashedpass });
        await user.save();
        res.status(201).json({
            Message: "Registration was succesfull",
            user: {
                name,
                email,
            },
        });
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(409).json({ error: "Email already registered" });
            return;
        }
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ error: "Invalid email or password" });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: "Invalid email or password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, env_1.config.jwtSecret, { expiresIn: env_1.config.jwtExpiresIn });
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.loginUser = loginUser;
const getUsers = async (req, res) => {
    try {
        const users = await User_1.default.find().select("-password");
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getUsers = getUsers;
