"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default
    .connect(process.env.MONGO_URI || "mongodb://mongo:27017/users")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error(`mongoDB connection faiure: ${err}`));
