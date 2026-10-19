
import { useEffect, useState } from "react";
import "./StudyTracker.css";

const STORAGE_KEY = "greenbite-study-sessions";

export default function StudyTracker() {
  const [sessions, setSessions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [subject, setSubject] = useState("");
  const [minutes, setMinutes] = useState("30");
  const [note, setNote] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const totalMinutes = sessions.reduce(
    (total, session) => total + session.minutes,
    0
  );

  function addSession(event) {
    event.preventDefault();

    const duration = Number(minutes);

    if (!subject.trim() || !Number.isFinite(duration) ||
        duration < 1 || duration > 1440) {
      return;
    }

    setSessions((current) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        subject: subject.trim(),
        minutes: duration,
        note: note.trim(),
        date: new Date().toLocaleDateString(),
      },
      ...current,
    ]);

    setSubject("");
    setMinutes("30");
    setNote("");
  }

  function deleteSession(id) {
    setSessions((current) =>
      current.filter((session) => session.id !== id)
    );
  }

  return (
    <main className="study-page">
      <header className="study-header">
        <span className="study-icon">📚</span>
        <h1>Study Tracker</h1>
        <p>Learn a little every day. Grow a lot over time! 🌱</p>
      </header>

      <section className="study-stats">
        <article className="study-stat-card">
          <span>⏱️</span>
          <h2>
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </h2>
          <p>Total study time</p>
        </article>

        <article className="study-stat-card">
          <span>🌟</span>
          <h2>{sessions.length}</h2>
          <p>Study sessions</p>
        </article>
      </section>

      <form className="study-form" onSubmit={addSession}>
        <h2>Log a study session ✨</h2>

        <label htmlFor="study-subject">Subject</label>
        <input
          id="study-subject"
          type="text"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="e.g. Mathematics"
          required
        />

        <label htmlFor="study-minutes">Duration in minutes</label>
        <input
          id="study-minutes"
          type="number"
          min="1"
          max="1440"
          value={minutes}
          onChange={(event) => setMinutes(event.target.value)}
          required
        />

        <label htmlFor="study-note">What did you learn? (optional)</label>
        <textarea
          id="study-note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Write a quick note..."
          rows="3"
        />

        <button className="study-add-button" type="submit">
          + Add Study Session
        </button>
      </form>

      <section className="study-history">
        <h2>Recent Study Sessions 🌿</h2>

        {sessions.length === 0 ? (
          <p className="study-empty">
            Your learning journey starts here. You've got this! 💚
          </p>
        ) : (
          sessions.map((session) => (
            <article className="study-session" key={session.id}>
              <div className="study-session-info">
                <h3>{session.subject}</h3>
                <p>
                  {session.minutes} minutes · {session.date}
                </p>
                {session.note && <p>{session.note}</p>}
              </div>

              <button
                className="study-delete-button"
                type="button"
                onClick={() => deleteSession(session.id)}
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
