"use client";

import { useEffect, useState } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
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
      const response = await fetch(
        "http://localhost:5000/api/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
          }),
        }
      );

      const data = await response.json();

      console.log("Created task:", data);

      setTasks((previousTasks) => [...previousTasks, data]);

      setTitle("");
      setDescription("");
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

  const handleUpdateTask = async (
    taskId: string,
    completed: boolean
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed,
          }),
        }
      );

      const updatedTask = await response.json();

      console.log("Updated task:", updatedTask);

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task._id === taskId ? updatedTask : task
        )
      );
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          My Tasks
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Manage your tasks and keep track of your progress.
        </Typography>
      </Box>

      {/* Add Task Form */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 5,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Add New Task
        </Typography>

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
          rows={4}
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
          onClick={handleAddTask}
        >
          Add Task
        </Button>
      </Paper>

      {/* Existing Tasks */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Existing Tasks
      </Typography>

      {tasks.length === 0 ? (
        <Typography color="text.secondary">
          No tasks available.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {tasks.map((task) => (
            <Paper
              key={task._id}
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 1 }}
              >
                {task.title}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                {task.description}
              </Typography>
              <Chip
                label={task.completed ? "Completed" : "Pending"}
                color={task.completed ? "success" : "warning"}
                size="small"
                sx={{ mb: 2 }}
              />
              <Stack direction="row" spacing={2}>
                <Button
                  variant={
                    task.completed ? "contained" : "outlined"
                  }
                  onClick={() =>
                    handleUpdateTask(
                      task._id,
                      !task.completed
                    )
                  }
                >
                  {task.completed
                    ? "Completed"
                    : "Mark as Completed"}
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() =>
                    handleDeleteTask(task._id)
                  }
                >
                  Delete
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
}