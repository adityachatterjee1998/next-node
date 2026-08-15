require("dotenv").config();
const cors = require("cors");
const Task = require("./models/Task");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

app.get("/api/tasks", (req, res) => {
  res.json([
    {
      id: 1,
      title: "Learn Node.js",
      completed: false,
    },
    {
      id: 2,
      title: "Learn Express",
      completed: false,
    },
  ]);
});

app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description } = req.body;

    const task = new Task({
      title,
      description,
    });

    const savedTask = await task.save();

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create task",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
