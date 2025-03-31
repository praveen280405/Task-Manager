const { useState, useEffect } = React;

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    text: "",
    dueDate: "",
    priority: "Low",
  });
  const [filter, setFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    const savedDarkMode = JSON.parse(localStorage.getItem("darkMode"));
    if (savedTasks) setTasks(savedTasks);
    if (savedDarkMode !== null) setDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [tasks, darkMode]);

  const addTask = () => {
    if (newTask.text.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), ...newTask, completed: false }]);
    setNewTask({ text: "", dueDate: "", priority: "Low" });
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks
    .filter((task) =>
      filter === "All"
        ? true
        : filter === "Completed"
        ? task.completed
        : !task.completed
    )
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className={darkMode ? "dark-mode container" : "container"}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="toggle-dark-mode"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
      <h2>Task Manager</h2>
      <input
        type="text"
        value={newTask.text}
        onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
        placeholder="Enter task"
      />
      <input
        type="date"
        value={newTask.dueDate}
        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
      />
      <select
        value={newTask.priority}
        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <button onClick={addTask}>Add Task</button>

      <div className="task-filters">
        <button onClick={() => setFilter("All")}>All</button>
        <button onClick={() => setFilter("Pending")}>Pending</button>
        <button onClick={() => setFilter("Completed")}>Completed</button>
      </div>

      <div>
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`task ${task.completed ? "completed" : ""}`}
          >
            <span onClick={() => toggleTask(task.id)}>
              {task.text} ({task.priority}) - {task.dueDate}
            </span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TaskManager />);
