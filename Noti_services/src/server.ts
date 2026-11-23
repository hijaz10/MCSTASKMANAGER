import "dotenv/config";
import { connectToRabbitMQ, channel } from "./config/rabbitmq";
import { handleTaskCreated } from "./consumers/taskCreatedConsumer";

async function start(): Promise<void> {
  try {
    await connectToRabbitMQ();

    channel.consume("task_created", handleTaskCreated);
  } catch (error: unknown) {
    console.error("Failed RabbitMQ connection", error);
  }
}

start();
