import jwt from "jsonwebtoken";
import { authenticate } from "../src/middlewares/auth";

function fakeRes() {
  const res: any = { locals: {} };
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

test("returns 401 when there is no token", () => {
  const req: any = { headers: {} };
  const res = fakeRes();
  const next = jest.fn();

  authenticate(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(next).not.toHaveBeenCalled();
});

test("returns 401 for an invalid token", () => {
  const req: any = { headers: { authorization: "Bearer not-a-real-token" } };
  const res = fakeRes();
  const next = jest.fn();

  authenticate(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(next).not.toHaveBeenCalled();
});

test("calls next() for a valid token", () => {
  const token = jwt.sign(
    { id: "1", email: "ada@example.com" },
    process.env.JWT_SECRET as string,
  );
  const req: any = { headers: { authorization: `Bearer ${token}` } };
  const res = fakeRes();
  const next = jest.fn();

  authenticate(req, res, next);

  expect(next).toHaveBeenCalled();
  expect(res.locals.user.email).toBe("ada@example.com");
});
