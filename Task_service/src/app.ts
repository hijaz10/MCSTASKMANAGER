import fs from "fs";
import path from "path";
import express, { Application } from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import { parse } from "yaml";
import taskRoutes from "./routes/taskRoutes";
const app: Application = express();

const openapiDocument = parse(
  fs.readFileSync(path.join(__dirname, "../openapi.yaml"), "utf8"),
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

app.use(bodyParser.json());

app.use("/api/v1/tasks", taskRoutes);

export default app;
