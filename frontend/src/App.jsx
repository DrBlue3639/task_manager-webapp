import { useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  function addTask() {
    setTasks([...tasks, task]);
    setTask("");
  }
  function deleteTask(index) {
    setTasks(tasks.filter((item, i) => i !== index));
  }

  return (
    <div>
      <h1>Task Manager</h1>
      <input
        type="text"
        placeholder="Enter a task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map((item, index) => (
          <li key={index}>
            {item} <button onClick={() => deleteTask(index)}> DELETE</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
