"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const rabbitmq_1 = require("./config/rabbitmq");
const taskCreatedConsumer_1 = require("./consumers/taskCreatedConsumer");
async function start() {
    try {
        await (0, rabbitmq_1.connectToRabbitMQ)();
        rabbitmq_1.channel.consume("task_created", taskCreatedConsumer_1.handleTaskCreated);
    }
    catch (error) {
        console.error("Failed RabbitMQ connection", error);
    }
}
start();
