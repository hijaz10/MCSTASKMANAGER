import amqp, { Channel } from "amqplib";

export let channel: Channel;
let connection: Awaited<ReturnType<typeof amqp.connect>>;

export async function connectToRabbitMQ(): Promise<void> {
  connection = await amqp.connect(
    process.env.RABBITMQ_URL || "amqp://rabbitmq",
  );
  channel = await connection.createChannel();
  await channel.assertQueue("task_created");
  console.log("Notification service is listening to messages");
}
