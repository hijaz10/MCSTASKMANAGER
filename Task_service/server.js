const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const amqp = require('amqplib')
const app = express()
const port = 3001

app.use(bodyParser.json())

mongoose.connect('mongodb://mongo:27017/users').then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(`mongoDB connection faiure: ${err}`))

const Task = new mongoose.Schema({
  title: {type: String, required:true},
  description: {type: String, required:true},
  userId: {type: String, required:true},
  createdAt: {type: String, required:true, default: Date.now},
})

const Tasks = mongoose.model('Tasks', Task)

let channel, connection;

async function connectToRabbitMQ(retries = 10, delay = 5000) {
    
    while(retries){
        try{
            connection = await amqp.connect("amqp://rabbitmq")
            channel = await connection.createChannel()
            await channel.assertQueue("task_created")
            console.log('connected tp RabbitMQ')
            return;
        }catch(error){
            console.error("Failed RabbitMQ connection", error);
            retries--
            console.error('retrying again: ', retries);
            await new Promise(res => setTimeout(res, delay))
        }
    }

}

app.post("/task", async (req, res) => {
  const { title, description, userId, userEmail } = req.body;

  try {
    const task = new Tasks({ title, description, userId });
    await task.save();

    const message = { taskId: task._id, userId, title, userEmail };

    if (!channel) {
      return res.status(503).json({ error: 'RabbitMQ not connected' });
    }

    channel.sendToQueue('task_created', Buffer.from(JSON.stringify(message)));

    res.status(201).json({
      message: 'Task added successfully',
      task: { title, description, userId, userEmail }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.put('/task/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const updatedTask = await Tasks.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({
      message: "Task updated successfully",
      task: updatedTask
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete('/task/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Tasks.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.get('/task', async ( req, res) => {
  const task = await Tasks.find()
  res.json(task);
})

app.listen(port, () => {
  console.log(`Task service listening on port ${port}`)
  connectToRabbitMQ()
})