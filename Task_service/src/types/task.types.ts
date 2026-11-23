import { Request } from "express";
import { Types } from "mongoose";

export interface ITask {
  title: string;
  description: string;
  userId: string;
  createdAt: string;
}

export interface CreateTaskBody {
  title: string;
  description: string;
  userId: string;
  userEmail: string;
}

export interface UpdateTaskBody {
  title: string;
  description: string;
}

export interface TaskParams {
  id: string;
}

export interface TaskMessage {
  taskId: Types.ObjectId;
  userId: string;
  title: string;
  userEmail: string;
}

export interface CreateTaskResponse {
  message: string;
  task: CreateTaskBody;
}

export interface UpdateTaskResponse {
  message: string;
  task: ITask;
}

export interface MessageResponse {
  message: string;
}

export interface ErrorResponse {
  error: string;
}

export type CreateTaskRequest = Request<
  {},
  CreateTaskResponse | ErrorResponse,
  CreateTaskBody
>;
export type UpdateTaskRequest = Request<
  TaskParams,
  UpdateTaskResponse | ErrorResponse,
  UpdateTaskBody
>;
export type DeleteTaskRequest = Request<
  TaskParams,
  MessageResponse | ErrorResponse
>;
