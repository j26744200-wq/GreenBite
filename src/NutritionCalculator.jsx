
import { useState } from 'react';
import './NutritionCalculator.css';

// Nutrition values are approximate and expressed per 100 g.
// Verify individual entries against the matching food record
// before presenting them as a verified nutrition database.

const foods = [
  // Fruits
  { id: 1, name: 'Apple, raw, with skin', calories: 52, protein: 0.26, carbs: 13.81, fat: 0.17 },
  { id: 2, name: 'Banana, raw', calories: 89, protein: 1.09, carbs: 22.84, fat: 0.33 },
  { id: 3, name: 'Orange, raw', calories: 47, protein: 0.94, carbs: 11.75, fat: 0.12 },
  { id: 4, name: 'Strawberries, raw', calories: 32, protein: 0.67, carbs: 7.68, fat: 0.30 },
  { id: 5, name: 'Grapes, raw', calories: 69, protein: 0.72, carbs: 18.10, fat: 0.16 },
  { id: 6, name: 'Avocado, raw', calories: 160, protein: 2.00, carbs: 8.53, fat: 14.66 },

  // Vegetables
  { id: 7, name: 'Broccoli, raw', calories: 34, protein: 2.82, carbs: 6.64, fat: 0.37 },
  { id: 8, name: 'Carrot, raw', calories: 41, protein: 0.93, carbs: 9.58, fat: 0.24 },
  { id: 9, name: 'Spinach, raw', calories: 23, protein: 2.86, carbs: 3.63, fat: 0.39 },
  { id: 10, name: 'Cucumber, raw', calories: 15, protein: 0.65, carbs: 3.63, fat: 0.11 },
  { id: 11, name: 'Tomato, raw', calories: 18, protein: 0.88, carbs: 3.89, fat: 0.20 },
  { id: 12, name: 'Potato, boiled', calories: 87, protein: 1.87, carbs: 20.13, fat: 0.10 },
  { id: 13, name: 'Sweet potato, baked', calories: 90, protein: 2.01, carbs: 20.71, fat: 0.15 },

  // Grains
  { id: 14, name: 'White rice, cooked', calories: 130, protein: 2.69, carbs: 28.17, fat: 0.28 },
  { id: 15, name: 'Oats, dry', calories: 389, protein: 16.90, carbs: 66.30, fat: 6.90 },
  { id: 16, name: 'Whole wheat bread', calories: 247, protein: 13.00, carbs: 41.40, fat: 4.20 },
  { id: 17, name: 'Quinoa, cooked', calories: 120, protein: 4.40, carbs: 21.30, fat: 1.92 },
  { id: 18, name: 'Pasta, cooked', calories: 158, protein: 5.80, carbs: 30.90, fat: 0.93 },

  // Pulses and legumes
  { id: 19, name: 'Lentils, boiled', calories: 116, protein: 9.02, carbs: 20.13, fat: 0.38 },
  { id: 20, name: 'Chickpeas, cooked', calories: 164, protein: 8.86, carbs: 27.42, fat: 2.59 },
  { id: 21, name: 'Black beans, cooked', calories: 132, protein: 8.86, carbs: 23.71, fat: 0.54 },

  // Dairy
  { id: 22, name: 'Milk, whole', calories: 61, protein: 3.15, carbs: 4.80, fat: 3.25 },
  { id: 23, name: 'Plain yogurt, whole milk', calories: 61, protein: 3.47, carbs: 4.66, fat: 3.25 },
  { id: 24, name: 'Cheddar cheese', calories: 403, protein: 24.90, carbs: 1.28, fat: 33.14 },

  // Nuts and nut butters
  { id: 25, name: 'Almonds', calories: 579, protein: 21.15, carbs: 21.55, fat: 49.93 },
  { id: 26, name: 'Peanut butter', calories: 588, protein: 25.09, carbs: 20.00, fat: 50.00 },
];

function formatNumber(value) {
  return Number(value.toFixed(2)).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  });
}

function NutritionCalculator() {
  const [selectedFoodId, setSelectedFoodId] = useState('1');
  const [quantity, setQuantity] = useState('100');

  const selectedFood = foods.find(
    (food) => food.id === Number(selectedFoodId)
  );

  const grams = quantity.trim() === '' ? 0 : Number(quantity);

  const validQuantity =
    quantity.trim() !== '' &&
    Number.isFinite(grams) &&
    grams >= 0;

  const multiplier = validQuantity ? grams / 100 : 0;

  const nutrition = selectedFood
    ? {
        calories: selectedFood.calories * multiplier,
        protein: selectedFood.protein * multiplier,
        carbs: selectedFood.carbs * multiplier,
        fat: selectedFood.fat * multiplier,
      }
    : null;

  return (
    <section className="nutrition-calculator">
      <div className="calculator-heading">
        <span className="calculator-icon" aria-hidden="true">
          🧮
        </span>

        <div>
          <p className="calculator-eyebrow">
            SMART FOOD CALCULATOR
          </p>

          <h2>Nutrition Calculator</h2>

          <p className="calculator-description">
            Select a food and enter its weight to estimate its nutrition.
          </p>
        </div>
      </div>

      <div className="calculator-form">
        <div className="form-group">
          <label htmlFor="nutrition-food">
            Choose a food
          </label>

          <select
            id="nutrition-food"
            value={selectedFoodId}
            onChange={(event) =>
              setSelectedFoodId(event.target.value)
            }
          >
            {foods.map((food) => (
              <option key={food.id} value={food.id}>
                {food.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="nutrition-quantity">
            Quantity in grams
          </label>

          <input
            id="nutrition-quantity"
            type="number"
            min="0"
            step="1"
            value={quantity}
            onChange={(event) =>
              setQuantity(event.target.value)
            }
            placeholder="Enter grams"
            aria-describedby="quantity-help"
          />

          <small id="quantity-help">
            Enter the food weight in grams.
          </small>
        </div>
      </div>

      {selectedFood && validQuantity && nutrition && (
        <>
          <div className="selected-food">
            <span>Selected food</span>

            <strong>{selectedFood.name}</strong>

            <small>
              Nutrition estimates are calculated per 100 g.
            </small>
          </div>

          <div className="calorie-result" aria-live="polite">
            <span>Estimated energy</span>

            <strong>
              {formatNumber(nutrition.calories)}
            </strong>

            <span>kcal</span>
          </div>

          <div className="nutrition-results">
            <div className="nutrient-card">
              <span aria-hidden="true">💪</span>
              <p>Protein</p>
              <strong>
                {formatNumber(nutrition.protein)} g
              </strong>
            </div>

            <div className="nutrient-card">
              <span aria-hidden="true">🌾</span>
              <p>Carbohydrates</p>
              <strong>
                {formatNumber(nutrition.carbs)} g
              </strong>
            </div>

            <div className="nutrient-card">
              <span aria-hidden="true">🥑</span>
              <p>Fat</p>
              <strong>
                {formatNumber(nutrition.fat)} g
              </strong>
            </div>
          </div>
        </>
      )}

      {!validQuantity && (
        <p className="calculator-error" role="alert">
          Please enter a valid, non-negative quantity in grams.
        </p>
      )}

      <p className="calculator-disclaimer">
        Nutrition values are estimates, not a verified database
        export. Actual values vary by variety, brand, preparation,
        and moisture content. Cooked and raw foods are listed
        separately where applicable.
      </p>
    </section>
  );
}

export default NutritionCalculator;
