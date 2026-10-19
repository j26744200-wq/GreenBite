import { useEffect, useState } from 'react';
import './StepsTracker.css';

const STORAGE_KEY = 'greenbite-steps-v1';
const DEFAULT_GOAL = 8000;

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function createDefaultData() {
  return {
    date: getToday(),
    goal: DEFAULT_GOAL,
    entries: [],
  };
}

function getSavedData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const data = JSON.parse(saved);

      if (
        data &&
        data.date === getToday() &&
        Number.isSafeInteger(data.goal) &&
        data.goal >= 100 &&
        data.goal <= 100000 &&
        Array.isArray(data.entries) &&
        data.entries.every(
          (entry) =>
            Number.isSafeInteger(entry.steps) &&
            entry.steps > 0 &&
            entry.steps <= 1000000 &&
            typeof entry.id === 'string'
        )
      ) {
        return data;
      }
    }
  } catch {
    // Use the default data if saved data cannot be read.
  }

  return createDefaultData();
}

function StepsTracker() {
  const [data, setData] = useState(getSavedData);
  const [stepInput, setStepInput] = useState('1000');
  const [goalInput, setGoalInput] = useState(String(data.goal));
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      setMessage('Unable to save progress in this browser.');
    }
  }, [data]);

  const totalSteps = data.entries.reduce(
    (total, entry) => total + entry.steps,
    0
  );

  const progress = Math.min((totalSteps / data.goal) * 100, 100);

  function addSteps(event) {
    event.preventDefault();

    const steps = Number(stepInput);

    if (
      !Number.isSafeInteger(steps) ||
      steps < 1 ||
      steps > 1000000
    ) {
      setMessage('Enter a whole number between 1 and 1,000,000.');
      return;
    }

    setData((previous) => ({
      ...previous,
      entries: [
        ...previous.entries,
        {
          id: `${Date.now()}-${Math.random()}`,
          steps,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ],
    }));

    setMessage(`${steps.toLocaleString()} steps added successfully.`);
  }

  function removeEntry(id) {
    setData((previous) => ({
      ...previous,
      entries: previous.entries.filter((entry) => entry.id !== id),
    }));

    setMessage('Step entry removed.');
  }

  function updateGoal(event) {
    event.preventDefault();

    const goal = Number(goalInput);

    if (
      !Number.isSafeInteger(goal) ||
      goal < 100 ||
      goal > 100000
    ) {
      setMessage('Enter a whole-number goal between 100 and 100,000.');
      return;
    }

    setData((previous) => ({
      ...previous,
      goal,
    }));

    setMessage('Daily step goal updated.');
  }

  function resetToday() {
    const confirmed = window.confirm(
      'Are you sure you want to clear today’s step entries?'
    );

    if (!confirmed) return;

    setData((previous) => ({
      ...previous,
      entries: [],
    }));

    setMessage('Today’s step entries have been cleared.');
  }

  return (
    <section className="steps-tracker">
      <div className="steps-heading">
        <div className="steps-title-icon">👟</div>

        <div>
          <p className="steps-eyebrow">DAILY MOVEMENT</p>
          <h2>Steps Tracker</h2>
          <p className="steps-description">
            Record your walking activity and follow your daily goal.
          </p>
        </div>
      </div>

      <div className="steps-summary">
        <div className="steps-summary-icon">🚶</div>

        <div className="steps-total">
          <span className="steps-small-label">Steps recorded today</span>

          <h3>{totalSteps.toLocaleString()}</h3>

          <p>
            Goal: {data.goal.toLocaleString()} steps
          </p>
        </div>

        <div className="steps-percentage">
          {Math.round(progress)}%
        </div>
      </div>

      <div
        className="steps-progress-track"
        role="progressbar"
        aria-label="Daily step goal progress"
        aria-valuenow={Math.round(progress)}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="steps-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="steps-progress-caption">
        {totalSteps >= data.goal
          ? 'Congratulations! You have reached your recorded step goal.'
          : `${(data.goal - totalSteps).toLocaleString()} steps remaining to reach your goal.`}
      </p>

      <div className="steps-quick-section">
        <h3>Quick Add</h3>
        <p className="steps-muted">
          Choose a number of steps to add to your daily total.
        </p>

        <div className="steps-quick-buttons">
          {[500, 1000, 2000, 5000].map((amount) => (
            <button
              key={amount}
              type="button"
              className="steps-amount-button"
              onClick={() => {
                setData((previous) => ({
                  ...previous,
                  entries: [
                    ...previous.entries,
                    {
                      id: `${Date.now()}-${Math.random()}`,
                      steps: amount,
                      time: new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      }),
                    },
                  ],
                }));

                setMessage(`${amount.toLocaleString()} steps added.`);
              }}
            >
              <span>👣</span>
              +{amount.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <form className="steps-custom-form" onSubmit={addSteps}>
        <label htmlFor="step-amount">Enter steps</label>

        <div className="steps-input-row">
          <input
            id="step-amount"
            type="number"
            min="1"
            max="1000000"
            step="1"
            value={stepInput}
            onChange={(event) => setStepInput(event.target.value)}
            required
          />

          <button type="submit" className="steps-primary-button">
            + Add Steps
          </button>
        </div>
      </form>

      <form className="steps-goal-form" onSubmit={updateGoal}>
        <label htmlFor="step-goal">Daily step goal</label>

        <div className="steps-input-row">
          <input
            id="step-goal"
            type="number"
            min="100"
            max="100000"
            step="1"
            value={goalInput}
            onChange={(event) => setGoalInput(event.target.value)}
            required
          />

          <button type="submit" className="steps-secondary-button">
            Update Goal
          </button>
        </div>

        <p className="steps-muted">
          Your goal is customizable. Choose a target suitable for your
          activity level and personal circumstances.
        </p>
      </form>

      <div className="steps-history">
        <div className="steps-history-heading">
          <div>
            <h3>Today's Entries</h3>
            <p className="steps-muted">
              {data.entries.length} recorded entr
              {data.entries.length === 1 ? 'y' : 'ies'}
            </p>
          </div>

          {data.entries.length > 0 && (
            <button
              type="button"
              className="steps-clear-button"
              onClick={resetToday}
            >
              Clear Today
            </button>
          )}
        </div>

        {data.entries.length === 0 ? (
          <div className="steps-empty">
            <span>👟</span>
            <p>No steps recorded yet.</p>
            <small>Add your first entry above.</small>
          </div>
        ) : (
          <ul className="steps-entry-list">
            {[...data.entries].reverse().map((entry) => (
              <li key={entry.id} className="steps-entry">
                <div className="steps-entry-icon">👣</div>

                <div className="steps-entry-details">
                  <strong>
                    {entry.steps.toLocaleString()} steps
                  </strong>
                  <span>{entry.time}</span>
                </div>

                <button
                  type="button"
                  className="steps-remove-button"
                  onClick={() => removeEntry(entry.id)}
                  aria-label={`Remove ${entry.steps} step entry`}
                  title="Remove entry"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {message && (
        <p className="steps-message" role="status">
          {message}
        </p>
      )}
    </section>
  );
}

export default StepsTracker;