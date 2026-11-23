"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yaml_1 = require("yaml");
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const app = (0, express_1.default)();
const openapiDocument = (0, yaml_1.parse)(fs_1.default.readFileSync(path_1.default.join(__dirname, "../openapi.yaml"), "utf8"));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapiDocument));
app.use(body_parser_1.default.json());
app.use("/api/v1/tasks", taskRoutes_1.default);
exports.default = app;
