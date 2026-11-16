import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Task Manager</h1>
      <p>Welcome to the Task Manager application</p>
    </div>
  );
}

export default App;
