const amqp = require('amqplib');
const nodemailer = require('nodemailer');
require('dotenv').config();

let channel, connection;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


async function start() {
    try {
        connection = await amqp.connect("amqp://rabbitmq");
        channel = await connection.createChannel();
        await channel.assertQueue("task_created");
        console.log('Notification service is listening to messages');

        channel.consume("task_created", async (msg) => {
            const taskData = JSON.parse(msg.content.toString());
            console.log("Notification: NEW TASK: ", taskData.title);

            if (taskData.userEmail) {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: taskData.userEmail,
                    subject: 'New Task Created',
                    text: `A new task has been created:\n\nTitle: ${taskData.title}\nTask ID: ${taskData.taskId}`
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log(`Email sent to ${taskData.userEmail}`);
                } catch (err) {
                    console.error('Failed to send email', err);
                }
            }

            channel.ack(msg);
        });
    } catch (error) {
        console.error("Failed RabbitMQ connection", error);
    }
}

start();
