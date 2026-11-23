import express, { Router } from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
} from "../controllers/taskController";

const router: Router = express.Router();

router.post("/task", createTask);

router.put("/task/:id", updateTask);

router.delete("/task/:id", deleteTask);

router.get("/task", getTasks);

export default router;
