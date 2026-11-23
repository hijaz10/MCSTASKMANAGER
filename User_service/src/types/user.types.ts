import { Request } from "express";

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface PublicUser {
  name: string;
  email: string;
}

export interface AuthPayload {
  id: string;
  email: string;
}

export interface RegisterResponse {
  Message: string;
  user: PublicUser;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: PublicUser;
}

export interface ErrorResponse {
  error: string;
  details?: { field: string; message: string }[];
}

export type RegisterRequest = Request<
  {},
  RegisterResponse | ErrorResponse,
  IUser
>;
export type LoginRequest = Request<
  {},
  LoginResponse | ErrorResponse,
  LoginBody
>;
