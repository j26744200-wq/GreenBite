import { useEffect, useState } from 'react';
import './HydrationTracker.css';

const STORAGE_KEY = 'greenbite-hydration-v1';

const DEFAULT_GOAL = 2000;
const WATER_AMOUNT = 250;

function getSavedData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const data = JSON.parse(saved);

      if (
        data &&
        typeof data.date === 'string' &&
        data.date === new Date().toLocaleDateString('en-CA') &&
        Array.isArray(data.drinks) &&
        Number.isFinite(data.goal) &&
        data.goal > 0
      ) {
        return data;
      }
    }
  } catch {
    // Use default values if saved data is unavailable.
  }

  return {
    date: new Date().toLocaleDateString('en-CA'),
    goal: DEFAULT_GOAL,
    drinks: [],
  };
}

function HydrationTracker() {
  const [data, setData] = useState(getSavedData);
  const [customAmount, setCustomAmount] = useState('250');
  const [goalInput, setGoalInput] = useState(String(data.goal));
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      setMessage('Unable to save progress in this browser.');
    }
  }, [data]);

  const totalWater = data.drinks.reduce(
    (total, drink) => total + drink.amount,
    0
  );

  const progress = Math.min((totalWater / data.goal) * 100, 100);

  function addWater(amount) {
    if (!Number.isFinite(amount) || amount < 1 || amount > 5000) {
      setMessage('Enter an amount between 1 and 5000 ml.');
      return;
    }

    setData((previous) => ({
      ...previous,
      drinks: [
        ...previous.drinks,
        {
          id: `${Date.now()}-${Math.random()}`,
          amount,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ],
    }));

    setMessage(`${amount} ml added successfully.`);
  }

  function removeWater(id) {
    setData((previous) => ({
      ...previous,
      drinks: previous.drinks.filter((drink) => drink.id !== id),
    }));

    setMessage('Water entry removed.');
  }

  function updateGoal(event) {
    event.preventDefault();

    const goal = Number(goalInput);

    if (!Number.isFinite(goal) || goal < 250 || goal > 10000) {
      setMessage('Set a goal between 250 and 10000 ml.');
      return;
    }

    setData((previous) => ({
      ...previous,
      goal,
    }));

    setMessage('Daily water goal updated.');
  }

  function resetToday() {
    const confirmed = window.confirm(
      'Are you sure you want to clear today’s water entries?'
    );

    if (!confirmed) return;

    setData((previous) => ({
      ...previous,
      drinks: [],
    }));

    setMessage('Today’s water entries have been cleared.');
  }

  return (
    <section className="hydration-tracker">
      <div className="hydration-heading">
        <div className="hydration-title-icon">💧</div>

        <div>
          <p className="hydration-eyebrow">DAILY WELLNESS</p>
          <h2>Hydration Tracker</h2>
          <p className="hydration-description">
            Record your water intake and monitor your daily goal.
          </p>
        </div>
      </div>

      <div className="hydration-summary">
        <div className="hydration-glass" aria-hidden="true">
          💧
        </div>

        <div className="hydration-total">
          <span className="hydration-small-label">Water recorded today</span>

          <h3>
            {totalWater.toLocaleString()} <span>ml</span>
          </h3>

          <p>
            Goal: {data.goal.toLocaleString()} ml
          </p>
        </div>

        <div className="hydration-percentage">
          {Math.round(progress)}%
        </div>
      </div>

      <div
        className="hydration-progress-track"
        role="progressbar"
        aria-label="Daily water goal progress"
        aria-valuenow={Math.round(progress)}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="hydration-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="hydration-progress-caption">
        {totalWater >= data.goal
          ? 'Your recorded intake has reached your daily goal!'
          : `${(data.goal - totalWater).toLocaleString()} ml remaining to reach your goal.`}
      </p>

      <div className="hydration-section">
        <h3>Quick Add</h3>
        <p className="hydration-muted">
          Select an amount to record the water you drank.
        </p>

        <div className="hydration-quick-buttons">
          {[150, 250, 500, 750].map((amount) => (
            <button
              key={amount}
              type="button"
              className="hydration-amount-button"
              onClick={() => addWater(amount)}
            >
              <span>💧</span>
              {amount} ml
            </button>
          ))}
        </div>
      </div>

      <form
        className="hydration-custom-form"
        onSubmit={(event) => {
          event.preventDefault();
          addWater(Number(customAmount));
        }}
      >
        <label htmlFor="custom-water-amount">
          Custom amount (ml)
        </label>

        <div className="hydration-input-row">
          <input
            id="custom-water-amount"
            type="number"
            min="1"
            max="5000"
            step="1"
            value={customAmount}
            onChange={(event) => setCustomAmount(event.target.value)}
            required
          />

          <button type="submit" className="hydration-primary-button">
            + Add Water
          </button>
        </div>
      </form>

      <form className="hydration-goal-form" onSubmit={updateGoal}>
        <label htmlFor="daily-water-goal">
          Daily goal (ml)
        </label>

        <div className="hydration-input-row">
          <input
            id="daily-water-goal"
            type="number"
            min="250"
            max="10000"
            step="50"
            value={goalInput}
            onChange={(event) => setGoalInput(event.target.value)}
            required
          />

          <button type="submit" className="hydration-secondary-button">
            Update Goal
          </button>
        </div>

        <p className="hydration-muted">
          Water needs vary by person, activity, climate, and health.
          This goal is customizable and is not medical advice.
        </p>
      </form>

      <div className="hydration-history">
        <div className="hydration-history-heading">
          <div>
            <h3>Today's Entries</h3>
            <p className="hydration-muted">
              {data.drinks.length} recorded drink(s)
            </p>
          </div>

          {data.drinks.length > 0 && (
            <button
              type="button"
              className="hydration-clear-button"
              onClick={resetToday}
            >
              Clear Today
            </button>
          )}
        </div>

        {data.drinks.length === 0 ? (
          <div className="hydration-empty">
            <span>🥛</span>
            <p>No water recorded yet.</p>
            <small>Add your first drink above.</small>
          </div>
        ) : (
          <ul className="hydration-entry-list">
            {[...data.drinks].reverse().map((drink) => (
              <li key={drink.id} className="hydration-entry">
                <div className="hydration-entry-icon">💧</div>

                <div className="hydration-entry-details">
                  <strong>{drink.amount} ml</strong>
                  <span>{drink.time}</span>
                </div>

                <button
                  type="button"
                  className="hydration-remove-button"
                  onClick={() => removeWater(drink.id)}
                  aria-label={`Remove ${drink.amount} ml water entry`}
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
        <p className="hydration-message" role="status">
          {message}
        </p>
      )}
    </section>
  );
}

export default HydrationTracker;   