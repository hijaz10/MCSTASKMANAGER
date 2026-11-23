import { handleTaskCreated } from "../src/consumers/taskCreatedConsumer";
import { transporter } from "../src/config/mailer";
import { channel } from "../src/config/rabbitmq";

jest.mock("../src/config/mailer", () => ({
  transporter: { sendMail: jest.fn() },
}));
jest.mock("../src/config/rabbitmq", () => ({
  channel: { ack: jest.fn() },
}));

const sendMail = transporter.sendMail as jest.Mock;
const ack = channel.ack as jest.Mock;

function makeMessage(data: object): any {
  return { content: Buffer.from(JSON.stringify(data)) };
}

test("sends an email and acknowledges the message", async () => {
  const msg = makeMessage({
    taskId: "1",
    userId: "user-1",
    title: "Write docs",
    userEmail: "ada@example.com",
  });

  await handleTaskCreated(msg);

  expect(sendMail).toHaveBeenCalledTimes(1);
  expect(sendMail.mock.calls[0][0].to).toBe("ada@example.com");
  expect(ack).toHaveBeenCalledWith(msg);
});

test("does not send an email when userEmail is missing", async () => {
  const msg = makeMessage({
    taskId: "1",
    userId: "user-1",
    title: "Write docs",
  });

  await handleTaskCreated(msg);

  expect(sendMail).not.toHaveBeenCalled();
  expect(ack).toHaveBeenCalledWith(msg);
});
