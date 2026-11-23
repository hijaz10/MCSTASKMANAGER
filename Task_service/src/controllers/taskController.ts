import { Request, Response } from "express";
import Tasks from "../models/Task";
import { channel } from "../config/rabbitmq";
import {
  ITask,
  TaskMessage,
  CreateTaskRequest,
  CreateTaskResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  DeleteTaskRequest,
  MessageResponse,
  ErrorResponse,
} from "../types/task.types";

export const createTask = async (
  req: CreateTaskRequest,
  res: Response<CreateTaskResponse | ErrorResponse>,
): Promise<void> => {
  const { title, description, userId, userEmail } = req.body;

  try {
    const task = new Tasks({ title, description, userId });
    await task.save();

    const message: TaskMessage = { taskId: task._id, userId, title, userEmail };

    if (!channel) {
      res.status(503).json({ error: "RabbitMQ not connected" });
      return;
    }

    channel.sendToQueue("task_created", Buffer.from(JSON.stringify(message)));

    res.status(201).json({
      message: "Task added successfully",
      task: { title, description, userId, userEmail },
    });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTask = async (
  req: UpdateTaskRequest,
  res: Response<UpdateTaskResponse | ErrorResponse>,
): Promise<void> => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const updatedTask = await Tasks.findByIdAndUpdate(
      id,
      { title, description },
      { new: true },
    );

    if (!updatedTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTask = async (
  req: DeleteTaskRequest,
  res: Response<MessageResponse | ErrorResponse>,
): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedTask = await Tasks.findByIdAndDelete(id);

    if (!deletedTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTasks = async (
  req: Request,
  res: Response<ITask[]>,
): Promise<void> => {
  const task = await Tasks.find();
  res.json(task);
};
