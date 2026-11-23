"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasks = exports.deleteTask = exports.updateTask = exports.createTask = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const rabbitmq_1 = require("../config/rabbitmq");
const createTask = async (req, res) => {
    const { title, description, userId, userEmail } = req.body;
    try {
        const task = new Task_1.default({ title, description, userId });
        await task.save();
        const message = { taskId: task._id, userId, title, userEmail };
        if (!rabbitmq_1.channel) {
            res.status(503).json({ error: "RabbitMQ not connected" });
            return;
        }
        rabbitmq_1.channel.sendToQueue("task_created", Buffer.from(JSON.stringify(message)));
        res.status(201).json({
            message: "Task added successfully",
            task: { title, description, userId, userEmail },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        const updatedTask = await Task_1.default.findByIdAndUpdate(id, { title, description }, { new: true });
        if (!updatedTask) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        res.json({
            message: "Task updated successfully",
            task: updatedTask,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTask = await Task_1.default.findByIdAndDelete(id);
        if (!deletedTask) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        res.json({ message: "Task deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.deleteTask = deleteTask;
const getTasks = async (req, res) => {
    const task = await Task_1.default.find();
    res.json(task);
};
exports.getTasks = getTasks;
