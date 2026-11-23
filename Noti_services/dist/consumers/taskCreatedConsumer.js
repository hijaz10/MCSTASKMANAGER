"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTaskCreated = void 0;
const rabbitmq_1 = require("../config/rabbitmq");
const mailer_1 = require("../config/mailer");
const handleTaskCreated = async (msg) => {
    if (!msg)
        return;
    const taskData = JSON.parse(msg.content.toString());
    console.log("Notification: NEW TASK: ", taskData.title);
    if (taskData.userEmail) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: taskData.userEmail,
            subject: "New Task Created",
            text: `A new task has been created:\n\nTitle: ${taskData.title}\nTask ID: ${taskData.taskId}`,
        };
        try {
            await mailer_1.transporter.sendMail(mailOptions);
            console.log(`Email sent to ${taskData.userEmail}`);
        }
        catch (err) {
            console.error("Failed to send email", err);
        }
    }
    rabbitmq_1.channel.ack(msg);
};
exports.handleTaskCreated = handleTaskCreated;
