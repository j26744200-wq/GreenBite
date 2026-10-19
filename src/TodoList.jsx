
import { useEffect, useState } from "react";
import "./TodoList.css";

const STORAGE_KEY = "greenbite-tasks";

export default function TodoList() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [taskText, setTaskText] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function addTask(event) {
    event.preventDefault();

    if (!taskText.trim()) return;

    setTasks((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random()}`,
        text: taskText.trim(),
        completed: false,
      },
    ]);

    setTaskText("");
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((current) =>
      current.filter((task) => task.id !== id)
    );
  }

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const visibleTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const progress = tasks.length
    ? (completedCount / tasks.length) * 100
    : 0;

  return (
    <main className="todo-page">
      <header className="todo-header">
        <span className="todo-icon">✅</span>
        <h1>My To-Do List</h1>
        <p>Grow, Glow & Go — one task at a time! 🌱</p>
      </header>

      <section className="todo-progress-card">
        <span className="todo-star">🌟</span>
        <h2>
          {completedCount} / {tasks.length}
        </h2>
        <p>Tasks completed</p>

        <div
          className="todo-progress-track"
          role="progressbar"
          aria-label="Task completion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div
            className="todo-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="todo-progress-caption">
          {tasks.length === 0
            ? "Every big goal begins with one small step."
            : `${Math.round(progress)}% complete — keep going!`}
        </p>
      </section>

      <form className="todo-form" onSubmit={addTask}>
        <h2>Add a New Task ✨</h2>

        <label htmlFor="todo-task">What's on your list?</label>

        <div className="todo-add-row">
          <input
            id="todo-task"
            type="text"
            value={taskText}
            onChange={(event) => setTaskText(event.target.value)}
            placeholder="e.g. Finish science homework"
            required
          />

          <button className="todo-add-button" type="submit">
            + Add
          </button>
        </div>
      </form>

      <section className="todo-list-section">
        <div className="todo-list-heading">
          <h2>My Tasks 🌿</h2>

          <label className="todo-filter-label">
            <span className="todo-sr-only">Filter tasks</span>
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">All tasks</option>
              <option value="active">To do</option>
              <option value="completed">Completed</option>
            </select>
          </label>
        </div>

        {visibleTasks.length === 0 ? (
          <p className="todo-empty">
            {tasks.length === 0
              ? "Your list is ready for your first little goal! 💚"
              : "No tasks here right now. Keep growing! 🌱"}
          </p>
        ) : (
          visibleTasks.map((task) => (
            <article
              className={`todo-task ${
                task.completed ? "todo-task-completed" : ""
              }`}
              key={task.id}
            >
              <label className="todo-task-label">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span>{task.text}</span>
              </label>

              <button
                className="todo-delete-button"
                type="button"
                onClick={() => deleteTask(task.id)}
                aria-label={`Delete task: ${task.text}`}
              >
                Delete
              </button>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
