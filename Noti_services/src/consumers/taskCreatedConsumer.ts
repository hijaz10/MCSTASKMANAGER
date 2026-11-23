import { ConsumeMessage } from "amqplib";
import { SendMailOptions } from "nodemailer";
import { channel } from "../config/rabbitmq";
import { transporter } from "../config/mailer";
import { TaskCreatedMessage } from "../types/notification.types";

export const handleTaskCreated = async (
  msg: ConsumeMessage | null,
): Promise<void> => {
  if (!msg) return;

  const taskData: TaskCreatedMessage = JSON.parse(msg.content.toString());
  console.log("Notification: NEW TASK: ", taskData.title);

  if (taskData.userEmail) {
    const mailOptions: SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: taskData.userEmail,
      subject: "New Task Created",
      text: `A new task has been created:\n\nTitle: ${taskData.title}\nTask ID: ${taskData.taskId}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${taskData.userEmail}`);
    } catch (err: unknown) {
      console.error("Failed to send email", err);
    }
  }

  channel.ack(msg);
};
