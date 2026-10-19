import { useEffect, useState } from 'react';
import './MealDiary.css';

const STORAGE_KEY = 'greenbite-meal-diary-v1';

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

function loadMeals() {
  try {
    const savedMeals = localStorage.getItem(STORAGE_KEY);

    if (!savedMeals) {
      return [];
    }

    const parsedMeals = JSON.parse(savedMeals);

    return Array.isArray(parsedMeals) ? parsedMeals : [];
  } catch {
    return [];
  }
}

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function MealDiary() {
  const [meals, setMeals] = useState(loadMeals);
  const [foodName, setFoodName] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [quantity, setQuantity] = useState('100');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [mealDate, setMealDate] = useState(getToday());
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
    } catch {
      setMessage('Unable to save data in this browser.');
    }
  }, [meals]);

  const selectedMeals = meals.filter(
    (meal) => meal.date === mealDate
  );

  const totals = selectedMeals.reduce(
    (total, meal) => ({
      calories: total.calories + meal.calories,
      protein: total.protein + meal.protein,
      carbs: total.carbs + meal.carbs,
      fat: total.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  function addMeal(event) {
    event.preventDefault();

    const name = foodName.trim();
    const grams = Number(quantity);
    const energy = Number(calories);
    const proteinValue = Number(protein || 0);
    const carbValue = Number(carbs || 0);
    const fatValue = Number(fat || 0);

    if (!name) {
      setMessage('Please enter a food name.');
      return;
    }

    if (
      !Number.isFinite(grams) ||
      grams <= 0 ||
      grams > 100000
    ) {
      setMessage('Enter a quantity greater than 0 grams.');
      return;
    }

    if (
      calories.trim() === '' ||
      !Number.isFinite(energy) ||
      energy < 0 ||
      energy > 100000
    ) {
      setMessage('Enter a valid calorie value.');
      return;
    }

    if (
      !Number.isFinite(proteinValue) ||
      proteinValue < 0 ||
      !Number.isFinite(carbValue) ||
      carbValue < 0 ||
      !Number.isFinite(fatValue) ||
      fatValue < 0
    ) {
      setMessage('Nutrient values must be zero or greater.');
      return;
    }

    const newMeal = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      type: mealType,
      quantity: grams,
      calories: energy,
      protein: proteinValue,
      carbs: carbValue,
      fat: fatValue,
      date: mealDate,
    };

    setMeals((currentMeals) => [...currentMeals, newMeal]);
    setFoodName('');
    setQuantity('100');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setMessage('Meal added successfully!');

  }

  function deleteMeal(id) {
    setMeals((currentMeals) =>
      currentMeals.filter((meal) => meal.id !== id)
    );

    setMessage('Meal removed from your diary.');
  }

  function formatNumber(value) {
    return Number(value.toFixed(2)).toString();
  }

  return (
    <section className="meal-diary">
      <div className="meal-diary-heading">
        <span className="meal-diary-icon">📔</span>

        <div>
          <span className="meal-diary-eyebrow">
            YOUR PERSONAL FOOD JOURNAL
          </span>

          <h2>My Meal Diary</h2>

          <p>
            Record your meals and review the nutrition information
            you enter for each day.
          </p>
        </div>
      </div>

      <section className="meal-summary">
        <div className="meal-summary-heading">
          <div>
            <span className="meal-diary-eyebrow">
              DAILY SUMMARY
            </span>

            <h3>Nutrition overview</h3>
          </div>

          <label className="meal-date-label">
            Select date
            <input
              type="date"
              value={mealDate}
              onChange={(event) => {
                setMealDate(event.target.value);
                setMessage('');
              }}
            />
          </label>
        </div>

        <div className="meal-summary-grid">
          <div className="meal-summary-card">
            <span>🔥 Calories</span>
            <strong>{formatNumber(totals.calories)}</strong>
            <small>kcal</small>
          </div>

          <div className="meal-summary-card">
            <span>💪 Protein</span>
            <strong>{formatNumber(totals.protein)}</strong>
            <small>grams</small>
          </div>

          <div className="meal-summary-card">
            <span>🌾 Carbohydrates</span>
            <strong>{formatNumber(totals.carbs)}</strong>
            <small>grams</small>
          </div>

          <div className="meal-summary-card">
            <span>🥑 Fat</span>
            <strong>{formatNumber(totals.fat)}</strong>
            <small>grams</small>
          </div>
        </div>
      </section>

      <section className="meal-form-card">
        <div className="meal-section-heading">
          <h3>➕ Add a meal</h3>
          <p>Enter the nutrition values for the quantity you ate.</p>
        </div>

        <form className="meal-form" onSubmit={addMeal}>
          <div className="meal-form-grid">
            <label>
              Food name *
              <input
                type="text"
                value={foodName}
                onChange={(event) => setFoodName(event.target.value)}
                placeholder="e.g. Apple"
                maxLength={100}
                required
              />
            </label>

            <label>
              Meal type *
              <select
                value={mealType}
                onChange={(event) => setMealType(event.target.value)}
              >
                {mealTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Quantity (grams) *
              <input
                type="number"
                min="1"
                max="100000"
                step="any"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                required
              />
            </label>

            <label>
              Calories (kcal) *
              <input
                type="number"
                min="0"
                max="100000"
                step="any"
                value={calories}
                onChange={(event) => setCalories(event.target.value)}
                placeholder="e.g. 95"
                required
              />
            </label>

            <label>
              Protein (g)
              <input
                type="number"
                min="0"
                step="any"
                value={protein}
                onChange={(event) => setProtein(event.target.value)}
                placeholder="0 if unknown"
              />
            </label>

            <label>
              Carbohydrates (g)
              <input
                type="number"
                min="0"
                step="any"
                value={carbs}
                onChange={(event) => setCarbs(event.target.value)}
                placeholder="0 if unknown"
              />
            </label>

            <label>
              Fat (g)
              <input
                type="number"
                min="0"
                step="any"
                value={fat}
                onChange={(event) => setFat(event.target.value)}
                placeholder="0 if unknown"
              />
            </label>
          </div>

          <button className="meal-add-button" type="submit">
            + Add to Diary
          </button>

          {message && (
            <p className="meal-form-message" role="status">
              {message}
            </p>
          )}
        </form>
      </section>

      <section className="meal-list-section">
        <div className="meal-section-heading">
          <h3>Today's Food Entries</h3>
          <p>
            {selectedMeals.length} {selectedMeals.length === 1 ? 'entry' : 'entries'}
            {' '}for {mealDate}
          </p>
        </div>

        {selectedMeals.length === 0 ? (
          <div className="meal-empty-state">
            <span>🍽️</span>
            <h4>No meals recorded for this date</h4>
            <p>Add a meal using the form above to get started.</p>
          </div>
        ) : (
          <div className="meal-list">
            {mealTypes.map((type) => {
              const typeMeals = selectedMeals.filter(
                (meal) => meal.type === type
              );

              if (typeMeals.length === 0) {
                return null;
              }

              return (
                <div className="meal-group" key={type}>
                  <h4>{type}</h4>

                  {typeMeals.map((meal) => (
                    <article className="meal-entry" key={meal.id}>
                      <div className="meal-entry-main">
                        <strong>{meal.name}</strong>

                        <span>
                          {formatNumber(meal.quantity)} g ·{' '}
                          {formatNumber(meal.calories)} kcal
                        </span>

                        <small>
                          Protein: {formatNumber(meal.protein)} g ·{' '}
                          Carbs: {formatNumber(meal.carbs)} g ·{' '}
                          Fat: {formatNumber(meal.fat)} g
                        </small>
                      </div>

                      <button
                        type="button"
                        className="meal-delete-button"
                        onClick={() => deleteMeal(meal.id)}
                        aria-label={`Delete ${meal.name}`}
                      >
                        Delete
                      </button>
                    </article>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <p className="meal-diary-disclaimer">
        Nutrition totals are calculated from the values you enter.
        They are not independently verified by this diary.
      </p>
    </section>
  );
}

export default MealDiary;