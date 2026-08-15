"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      });
  }, []);

  return (
    <main>
      <h1>My Tasks</h1>

      {tasks.map((task) => (
        <div key={task.id}>
          <h2>Task : {task.id}</h2>
          <h3>{task.title}</h3>
          <p>
            Status: {task.completed ? "Completed" : "Pending"}
          </p>
          <br></br>
        </div>
      ))}
    </main>
  );
}