import request from "supertest";
import app from "../src/app";

// Full path = the prefix from app.ts + the path from userRoutes.ts
const base = "/api/v1/auth";

test("GET /users without a token returns 401", async () => {
  const res = await request(app).get(`${base}/users`);
  expect(res.status).toBe(401);
});

test("POST /users with invalid data returns 400", async () => {
  const res = await request(app)
    .post(`${base}/users`)
    .send({ name: "A", email: "bad-email", password: "123" });

  expect(res.status).toBe(400);
  expect(res.body.error).toBe("Validation failed");
});

test("POST /login with an empty body returns 400", async () => {
  const res = await request(app).post(`${base}/login`).send({});
  expect(res.status).toBe(400);
});
