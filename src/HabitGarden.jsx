import React, { useEffect, useState } from "react";
import "./HabitGarden.css";

const DEFAULT_HABITS = [
  { id: 1, name: "Drink enough water", emoji: "💧" },
  { id: 2, name: "Read for 15 minutes", emoji: "📚" },
  { id: 3, name: "Move my body", emoji: "🌞" },
];

const STORAGE_KEY = "greenbite-habits";
const TODAY_KEY = "greenbite-habit-completions";

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export default function HabitTracker() {
  const [habits, setHabits] = useState(() =>
    loadFromStorage(STORAGE_KEY, DEFAULT_HABITS)
  );

  const [completions, setCompletions] = useState(() =>
    loadFromStorage(TODAY_KEY, {})
  );

  const [habitName, setHabitName] = useState("");
  const [habitEmoji, setHabitEmoji] = useState("🌱");
  const [message, setMessage] = useState("");

  const today = getToday();
  const completedCount = habits.filter(
    (habit) => completions[today]?.includes(habit.id)
  ).length;

  const progress =
    habits.length > 0
      ? Math.round((completedCount / habits.length) * 100)
      : 0;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch {
      setMessage("Storage is unavailable. Your changes may not be saved.");
    }
  }, [habits]);

  useEffect(() => {
    try {
      localStorage.setItem(TODAY_KEY, JSON.stringify(completions));
    } catch {
      setMessage("Storage is unavailable. Your changes may not be saved.");
    }
  }, [completions]);

  function toggleHabit(id) {
    const todayCompleted = completions[today] || [];
    const isCompleted = todayCompleted.includes(id);

    setCompletions((previous) => ({
      ...previous,
      [today]: isCompleted
        ? (previous[today] || []).filter((habitId) => habitId !== id)
        : [...(previous[today] || []), id],
    }));

    setMessage(
      isCompleted
        ? "Habit unchecked. Every step counts! 🌱"
        : "Wonderful work! You're growing! ✨"
    );
  }

  function addHabit(event) {
    event.preventDefault();

    const name = habitName.trim();

    if (!name) {
      setMessage("Please enter a habit name.");
      return;
    }

    if (habits.length >= 20) {
      setMessage("Your garden can hold up to 20 habits.");
      return;
    }

    const newHabit = {
      id: Date.now(),
      name,
      emoji: habitEmoji,
    };

    setHabits((previous) => [...previous, newHabit]);
    setHabitName("");
    setHabitEmoji("🌱");
    setMessage("A new habit has been planted! 🌿");
  }

  function deleteHabit(id) {
    setHabits((previous) => previous.filter((habit) => habit.id !== id));

    setCompletions((previous) => {
      const updated = {};

      Object.entries(previous).forEach(([date, ids]) => {
        updated[date] = ids.filter((habitId) => habitId !== id);
      });

      return updated;
    });

    setMessage("Habit removed from your garden.");
  }

  let plant = "🌱";
  let plantStage = "Seedling";

  if (progress === 100 && habits.length > 0) {
    plant = "🌳";
    plantStage = "Garden in bloom";
  } else if (progress >= 60) {
    plant = "🌻";
    plantStage = "Growing strong";
  } else if (progress >= 30) {
    plant = "🪴";
    plantStage = "Taking root";
  }

  return (
    <main className="habit-page">
      <section className="habit-hero">
        <span className="habit-eyebrow">YOUR LITTLE SPACE TO GROW</span>
        <h1>🌿 Habit Garden</h1>
        <p>
          Small steps every day lead to beautiful growth.
          Plant a habit, nurture it, and celebrate your progress!
        </p>
      </section>

      <section className="habit-summary">
        <div className="habit-plant" aria-label={plantStage}>
          <span>{plant}</span>
          <h2>{plantStage}</h2>
          <p>Keep showing up for yourself.</p>
        </div>

        <div className="habit-progress-card">
          <div className="habit-progress-heading">
            <div>
              <h2>Today's growth</h2>
              <p>{completedCount} of {habits.length} habits completed</p>
            </div>
            <strong>{progress}%</strong>
          </div>

          <div
            className="habit-progress-track"
            role="progressbar"
            aria-label="Today's habit progress"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="habit-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="habit-encouragement">
            {habits.length === 0
              ? "Plant your first habit to begin!"
              : progress === 100
              ? "You did it! Your garden is blooming! 🎉"
              : "You're growing at your own pace. Keep going! 💚"}
          </p>
        </div>
      </section>

      <section className="habit-list-section">
        <div className="habit-section-heading">
          <div>
            <h2>My daily habits 🌱</h2>
            <p>Check off each habit as you complete it.</p>
          </div>
          <span className="habit-date">
            {new Date().toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {habits.length === 0 ? (
          <div className="habit-empty">
            <span>🌼</span>
            <h3>Your garden is waiting!</h3>
            <p>Add a habit below and watch your progress grow.</p>
          </div>
        ) : (
          <div className="habit-list">
            {habits.map((habit) => {
              const isCompleted =
                completions[today]?.includes(habit.id) || false;

              return (
                <article
                  className={`habit-item ${isCompleted ? "is-completed" : ""}`}
                  key={habit.id}
                >
                  <button
                    type="button"
                    className="habit-check"
                    onClick={() => toggleHabit(habit.id)}
                    aria-label={
                      isCompleted
                        ? `Mark ${habit.name} incomplete`
                        : `Complete ${habit.name}`
                    }
                    aria-pressed={isCompleted}
                  >
                    {isCompleted ? "✓" : ""}
                  </button>

                  <span className="habit-item-emoji">{habit.emoji}</span>

                  <span className="habit-item-name">{habit.name}</span>

                  {isCompleted && (
                    <span className="habit-done-label">Done!</span>
                  )}

                  <button
                    type="button"
                    className="habit-delete"
                    onClick={() => deleteHabit(habit.id)}
                    aria-label={`Delete ${habit.name}`}
                    title="Delete habit"
                  >
                    ×
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="habit-add-section">
        <h2>Plant a new habit 🌷</h2>
        <p>Choose one little thing you'd like to do regularly.</p>

        <form className="habit-add-form" onSubmit={addHabit}>
          <label htmlFor="habit-emoji">Choose an emoji</label>
          <select
            id="habit-emoji"
            value={habitEmoji}
            onChange={(event) => setHabitEmoji(event.target.value)}
          >
            <option value="🌱">🌱 Plant</option>
            <option value="💧">💧 Water</option>
            <option value="📚">📚 Read</option>
            <option value="🧘">🧘 Relax</option>
            <option value="🏃">🏃 Move</option>
            <option value="🥗">🥗 Eat well</option>
            <option value="✨">✨ Self-care</option>
            <option value="🎯">🎯 Goal</option>
            <option value="💤">💤 Sleep</option>
            <option value="🎨">🎨 Create</option>
          </select>

          <label htmlFor="habit-name">Habit name</label>
          <input
            id="habit-name"
            type="text"
            placeholder="e.g. Practice a new skill"
            value={habitName}
            onChange={(event) => setHabitName(event.target.value)}
            maxLength={60}
          />

          <button className="habit-add-button" type="submit">
            + Plant Habit
          </button>
        </form>

        <p className="habit-message" role="status" aria-live="polite">
          {message}
        </p>
      </section>

      <footer className="habit-footer">
        <span>🌿</span>
        <p>Grow, Glow &amp; Go!</p>
        <small>You don't have to grow fast. Just keep growing. 💚</small>
      </footer>
    </main>
  );
}
