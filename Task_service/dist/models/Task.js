"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Task = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: String, required: true },
    createdAt: { type: String, required: true, default: Date.now },
});
const Tasks = mongoose_1.default.model("Tasks", Task);
exports.default = Tasks;
