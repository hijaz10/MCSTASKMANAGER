import fs from "fs";
import path from "path";
import express, { Application } from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import { parse } from "yaml";
import userRoutes from "./routes/userRoutes";
import { generalLimiter } from "./middlewares/rateLimiter";

const app: Application = express();
app.set("trust proxy", 1);

const openapiDocument = parse(
  fs.readFileSync(path.join(__dirname, "../openapi.yaml"), "utf8"),
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

app.use(generalLimiter);

app.use(bodyParser.json({ limit: "10kb" }));

app.use("/api/v1/auth", userRoutes);

export default app;
