"use client";

import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      });
  }, []);

  const handleAddTask = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      const data = await response.json();

      console.log("Created task:", data);

      setTasks((previousTasks) => [...previousTasks, data]);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      console.log(data);

      setTasks((previousTasks) =>
        previousTasks.filter((task) => task._id !== taskId)
      );
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <main>
      <h1>My Tasks</h1>

      <TextField
        label="Task Title"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <TextField
        label="Description"
        fullWidth
        multiline
        rows={3}
        margin="normal"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button
        variant="contained"
        sx={{ marginTop: 2 }}
        onClick={handleAddTask}
      >
        Add Task
      </Button>
      {/* <h1>Test</h1>
      <p>Title: {title}</p>
      <p>Description: {description}</p> */}

      <h2>Existing Tasks</h2>

      {tasks.map((task) => (
        <div key={task._id}>
          <h3>task:{task.title}</h3>
          <h3>description:{task.description}</h3>
          <p>
            Status: {task.completed ? "Completed" : "Pending"}
          </p>
          <Button
            variant="outlined"
            onClick={() => handleDeleteTask(task._id)}
          >
            Delete
          </Button>
        </div>
      ))}
    </main>
  );
}