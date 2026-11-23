import amqp, { Channel } from "amqplib";

export let channel: Channel | undefined;
let connection: Awaited<ReturnType<typeof amqp.connect>> | undefined;

export async function connectToRabbitMQ(
  retries: number = 10,
  delay: number = 5000,
): Promise<void> {
  while (retries) {
    try {
      connection = await amqp.connect(
        process.env.RABBITMQ_URL || "amqp://rabbitmq",
      );
      channel = await connection.createChannel();
      await channel.assertQueue("task_created");
      console.log("connected tp RabbitMQ");
      return;
    } catch (error: unknown) {
      console.error("Failed RabbitMQ connection", error);
      retries--;
      console.error("retrying again: ", retries);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}
