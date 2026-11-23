import "./config/db";
import app from "./app";
import { connectToRabbitMQ } from "./config/rabbitmq";
const port: number = 3001;

app.listen(port, () => {
  console.log(`Task service listening on port ${port}`);
  connectToRabbitMQ();
});
