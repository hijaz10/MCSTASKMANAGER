import mongoose from "mongoose";

const Task = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: String, required: true, default: Date.now },
});

const Tasks = mongoose.model("Tasks", Task);

export default Tasks;
