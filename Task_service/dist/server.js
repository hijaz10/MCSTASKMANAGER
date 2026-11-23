"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/db");
const app_1 = __importDefault(require("./app"));
const rabbitmq_1 = require("./config/rabbitmq");
const port = 3001;
app_1.default.listen(port, () => {
    console.log(`Task service listening on port ${port}`);
    (0, rabbitmq_1.connectToRabbitMQ)();
});
