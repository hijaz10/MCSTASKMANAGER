import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../models/User";
import { config } from "../config/env";
import {
  PublicUser,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ErrorResponse,
} from "../types/user.types";

export const registerUser = async (
  req: RegisterRequest,
  res: Response<RegisterResponse | ErrorResponse>,
): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const hashedpass: string = await bcrypt.hash(password, 10);

    const user = new Users({ name, email, password: hashedpass });

    await user.save();
    res.status(201).json({
      Message: "Registration was succesfull",
      user: {
        name,
        email,
      },
    });
  } catch (error: unknown) {
    if ((error as { code?: number }).code === 11000) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (
  req: LoginRequest,
  res: Response<LoginResponse | ErrorResponse>,
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    const token: string = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUsers = async (
  req: Request,
  res: Response<PublicUser[] | ErrorResponse>,
): Promise<void> => {
  try {
    const users = await Users.find().select("-password");
    res.json(users);
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
