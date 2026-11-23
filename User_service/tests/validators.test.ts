import { registerSchema, loginSchema } from "../src/validators/user.validator";

const validUser = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  password: "password123",
};

test("accepts valid registration data", () => {
  expect(registerSchema.safeParse(validUser).success).toBe(true);
});

test("trims and lowercases the email", () => {
  const result = registerSchema.parse({
    ...validUser,
    email: "  ADA@Example.com ",
  });
  expect(result.email).toBe("ada@example.com");
});

test("rejects an invalid email", () => {
  const result = registerSchema.safeParse({
    ...validUser,
    email: "not-an-email",
  });
  expect(result.success).toBe(false);
});

test("rejects a password shorter than 8 characters", () => {
  const result = registerSchema.safeParse({ ...validUser, password: "short" });
  expect(result.success).toBe(false);
});

test("rejects a name shorter than 2 characters", () => {
  const result = registerSchema.safeParse({ ...validUser, name: "A" });
  expect(result.success).toBe(false);
});

test("login accepts valid credentials", () => {
  const result = loginSchema.safeParse({
    email: "ada@example.com",
    password: "password123",
  });
  expect(result.success).toBe(true);
});

test("login rejects an empty password", () => {
  const result = loginSchema.safeParse({
    email: "ada@example.com",
    password: "",
  });
  expect(result.success).toBe(false);
});
