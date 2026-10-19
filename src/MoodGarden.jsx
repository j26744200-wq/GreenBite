import React, { useEffect, useState } from "react";
import "./MoodGarden.css";

const MOODS = [
  { emoji: "😊", name: "Happy", message: "Let your happiness bloom!" },
  { emoji: "😌", name: "Calm", message: "Enjoy this peaceful moment." },
  { emoji: "😴", name: "Tired", message: "Rest is part of growing, too." },
  { emoji: "😟", name: "Stressed", message: "Take one small step at a time." },
  { emoji: "😢", name: "Sad", message: "Be gentle with yourself today." },
];

const STORAGE_KEY = "greenbite-mood-garden";

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function readEntries() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function MoodGarden() {
  const [entries, setEntries] = useState(readEntries);
  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [storageError, setStorageError] = useState(false);

  const today = getToday();
  const todayEntry = entries.find((entry) => entry.date === today);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [entries]);

  useEffect(() => {
    if (todayEntry) {
      setSelectedMood(todayEntry.mood);
      setNote(todayEntry.note || "");
    }
  }, [todayEntry?.date, todayEntry?.mood, todayEntry?.note]);

  const flowers = Math.min(entries.length, 12);

  function saveMood(event) {
    event.preventDefault();

    if (!selectedMood) {
      setMessage("Choose the mood that feels right for you. 💚");
      return;
    }

    const existingEntry = entries.find((entry) => entry.date === today);

    const newEntry = {
      date: today,
      mood: selectedMood,
      note: note.trim(),
    };

    if (existingEntry) {
      setEntries((previous) =>
        previous.map((entry) =>
          entry.date === today ? newEntry : entry
        )
      );
    } else {
      setEntries((previous) =>
        [...previous, newEntry].sort((a, b) =>
          b.date.localeCompare(a.date)
        )
      );
    }

    setMessage("Your feelings have been planted in your garden! 🌷");
  }

  function deleteEntry(date) {
    setEntries((previous) =>
      previous.filter((entry) => entry.date !== date)
    );

    if (date === today) {
      setSelectedMood("");
      setNote("");
    }

    setMessage("Your check-in has been removed.");
  }

  const selectedMoodInfo = MOODS.find(
    (mood) => mood.name === selectedMood
  );

  return (
    <main className="mood-garden">
      <section className="mg-hero">
        <span className="mg-eyebrow">YOUR LITTLE SPACE TO FEEL</span>
        <h1>🌷 Mood Garden</h1>
        <p>
          Every feeling deserves a little space. Check in with yourself,
          write what is on your mind, and grow at your own pace.
        </p>
      </section>

      <section className="mg-garden-card">
        <div className="mg-garden-art" aria-label={`${flowers} garden flowers`}>
          <div className="mg-sun">☀️</div>
          <div className="mg-flower-row">
            {Array.from({ length: Math.max(1, flowers) }, (_, index) => (
              <span
                className="mg-flower"
                key={index}
                style={{ "--flower-index": index }}
              >
                {["🌷", "🌼", "🌸", "🌻"][index % 4]}
              </span>
            ))}
          </div>
          <div className="mg-grass">🌿🌱🌿🌱🌿🌱🌿</div>
        </div>

        <div className="mg-garden-info">
          <span className="mg-stat-number">{entries.length}</span>
          <h2>{entries.length === 1 ? "Check-in planted" : "Check-ins planted"}</h2>
          <p>
            Every time you check in, you give yourself a moment of care.
          </p>
          <div className="mg-garden-progress">
            <div
              className="mg-garden-progress-fill"
              style={{ width: `${(flowers / 12) * 100}%` }}
            />
          </div>
          <small>{flowers}/12 flowers in your garden</small>
        </div>
      </section>

      <section className="mg-checkin-card">
        <div className="mg-section-heading">
          <span className="mg-section-emoji">💚</span>
          <div>
            <h2>How are you feeling today?</h2>
            <p>There are no wrong answers.</p>
          </div>
        </div>

        {todayEntry && (
          <div className="mg-saved-banner">
            🌱 You have already checked in today. You can update your entry.
          </div>
        )}

        <form onSubmit={saveMood}>
          <div className="mg-mood-options">
            {MOODS.map((mood) => (
              <button
                key={mood.name}
                type="button"
                className={`mg-mood-option ${
                  selectedMood === mood.name ? "mg-mood-selected" : ""
                }`}
                onClick={() => {
                  setSelectedMood(mood.name);
                  setMessage("");
                }}
                aria-pressed={selectedMood === mood.name}
              >
                <span className="mg-mood-emoji">{mood.emoji}</span>
                <span>{mood.name}</span>
              </button>
            ))}
          </div>

          {selectedMoodInfo && (
            <p className="mg-mood-message" aria-live="polite">
              {selectedMoodInfo.emoji} {selectedMoodInfo.message}
            </p>
          )}

          <label className="mg-label" htmlFor="mg-note">
            A few words about your day (optional)
          </label>

          <textarea
            id="mg-note"
            className="mg-textarea"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="What is on your mind today?"
            maxLength={500}
            rows={4}
          />

          <div className="mg-character-count">{note.length}/500</div>

          <button className="mg-save-button" type="submit">
            🌷 {todayEntry ? "Update Today's Check-in" : "Plant Today's Mood"}
          </button>

          <p className="mg-feedback" role="status" aria-live="polite">
            {message}
          </p>

          {storageError && (
            <p className="mg-storage-warning">
              Your browser could not save this data. Check your browser storage
              settings before leaving the page.
            </p>
          )}
        </form>
      </section>

      <section className="mg-history-section">
        <div className="mg-section-heading">
          <span className="mg-section-emoji">📖</span>
          <div>
            <h2>Your Mood Journal</h2>
            <p>Look back at the moments you have recorded.</p>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="mg-empty-state">
            <span>🌱</span>
            <h3>Your garden is waiting to bloom!</h3>
            <p>Save your first mood check-in to start your journal.</p>
          </div>
        ) : (
          <div className="mg-history-list">
            {[...entries]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((entry) => {
                const moodInfo = MOODS.find(
                  (mood) => mood.name === entry.mood
                );

                return (
                  <article className="mg-history-item" key={entry.date}>
                    <div className="mg-history-emoji">
                      {moodInfo?.emoji || "🌷"}
                    </div>

                    <div className="mg-history-content">
                      <div className="mg-history-topline">
                        <h3>{entry.mood}</h3>
                        <time dateTime={entry.date}>
                          {formatDate(entry.date)}
                        </time>
                      </div>

                      <p>
                        {entry.note || "No journal note added."}
                      </p>
                    </div>

                    <button
                      className="mg-delete-button"
                      type="button"
                      onClick={() => deleteEntry(entry.date)}
                      aria-label={`Delete mood entry for ${formatDate(entry.date)}`}
                      title="Delete entry"
                    >
                      ×
                    </button>
                  </article>
                );
              })}
          </div>
        )}
      </section>

      <footer className="mg-footer">
        <span>🌿 🌷 🌿</span>
        <h2>Feel, Bloom &amp; Grow!</h2>
        <p>
          Every feeling is a visitor. Give yourself kindness, whatever today
          brings. 💚
        </p>
      </footer>
    </main>
  );
}