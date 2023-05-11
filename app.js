const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/taskDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Task model
const taskSchema = new mongoose.Schema({
  description: String,
  completed: Boolean,
});

const Task = mongoose.model("Task", taskSchema);

// Middleware to parse JSON bodies
app.use(express.json());

// Serve only the static files form the app directory
app.use(express.static(__dirname + "/app"));

// CRUD endpoints
app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

app.post("/api/tasks", async (req, res) => {
  const newTask = new Task(req.body);
  const result = await newTask.save();
  res.send(result);
});

app.put("/api/tasks/:id", async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }); // "new: true" returns the updated document
  res.send(updatedTask);
});

app.delete("/api/tasks/:id", async (req, res) => {
  const result = await Task.findByIdAndRemove(req.params.id);
  res.send(result);
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/app/index.html"));
});

// Start the app by listening on the default port
app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
