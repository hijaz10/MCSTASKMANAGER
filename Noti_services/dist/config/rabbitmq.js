"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.channel = void 0;
exports.connectToRabbitMQ = connectToRabbitMQ;
const amqplib_1 = __importDefault(require("amqplib"));
let connection;
async function connectToRabbitMQ() {
    connection = await amqplib_1.default.connect(process.env.RABBITMQ_URL || "amqp://rabbitmq");
    exports.channel = await connection.createChannel();
    await exports.channel.assertQueue("task_created");
    console.log("Notification service is listening to messages");
}
