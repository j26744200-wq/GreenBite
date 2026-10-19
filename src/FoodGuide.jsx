import { useMemo, useState } from 'react';
import './FoodGuide.css';

const foods = [
  {
    id: 1,
    name: 'Apple',
    category: 'Fruits',
    calories: 52,
    protein: 0.26,
    carbs: 13.81,
    fat: 0.17,
  },
  {
    id: 2,
    name: 'Banana',
    category: 'Fruits',
    calories: 89,
    protein: 1.09,
    carbs: 22.84,
    fat: 0.33,
  },
  {
    id: 3,
    name: 'Orange',
    category: 'Fruits',
    calories: 47,
    protein: 0.94,
    carbs: 11.75,
    fat: 0.12,
  },
  {
    id: 4,
    name: 'Broccoli',
    category: 'Vegetables',
    calories: 34,
    protein: 2.82,
    carbs: 6.64,
    fat: 0.37,
  },
  {
    id: 5,
    name: 'Carrot',
    category: 'Vegetables',
    calories: 41,
    protein: 0.93,
    carbs: 9.58,
    fat: 0.24,
  },
  {
    id: 6,
    name: 'Potato, boiled',
    category: 'Vegetables',
    calories: 87,
    protein: 1.87,
    carbs: 20.13,
    fat: 0.1,
  },
  {
    id: 7,
    name: 'White rice, cooked',
    category: 'Grains',
    calories: 130,
    protein: 2.69,
    carbs: 28.17,
    fat: 0.28,
  },
  {
    id: 8,
    name: 'Oats, dry',
    category: 'Grains',
    calories: 379,
    protein: 13.15,
    carbs: 67.7,
    fat: 6.52,
  },
  {
  id: 9,
  name: "Paneer",
  category: "Protein Foods",
  calories: 265,
  protein: 18.3,
  carbs: 1.2,
  fat: 20.8
  },
  {
    id: 10,
    name: 'Lentils, cooked',
    category: 'Protein Foods',
    calories: 116,
    protein: 9.02,
    carbs: 20.13,
    fat: 0.38,
  },
  {
    id: 11,
    name: 'Milk, whole',
    category: 'Dairy',
    calories: 61,
    protein: 3.15,
    carbs: 4.8,
    fat: 3.25,
  },
  {
    id: 12,
    name: 'Yogurt, plain, whole milk',
    category: 'Dairy',
    calories: 61,
    protein: 3.47,
    carbs: 4.66,
    fat: 3.25,
  },
];

const categories = [
  'All',
  'Fruits',
  'Vegetables',
  'Grains',
  'Protein Foods',
  'Dairy',
];

function FoodGuide() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filteredFoods = useMemo(() => {
    const term = search.trim().toLowerCase();

    return foods.filter((food) => {
      const matchesName = food.name.toLowerCase().includes(term);
      const matchesCategory =
        category === 'All' || food.category === category;

      return matchesName && matchesCategory;
    });
  }, [search, category]);

  return (
    <section className="food-guide">
      <div className="food-guide-heading">
        <span className="food-guide-icon">🥗</span>

        <div>
          <span className="food-guide-eyebrow">
            KNOW WHAT YOU EAT
          </span>

          <h2>Food Guide</h2>

          <p>
            Search common foods and explore their nutritional values.
          </p>
        </div>
      </div>

      <div className="food-guide-filters">
        <label className="food-guide-search">
          <span>🔍</span>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search for a food..."
            aria-label="Search foods"
          />
        </label>

        <label className="food-guide-category">
          Category

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="food-guide-count">
        Showing {filteredFoods.length} of {foods.length} foods
      </p>

      <div className="food-guide-grid">
        {filteredFoods.map((food) => (
          <article className="food-guide-card" key={food.id}>
            <div className="food-guide-card-heading">
              <div>
                <span className="food-guide-card-category">
                  {food.category}
                </span>

                <h3>{food.name}</h3>
              </div>

              <span className="food-guide-calorie-icon">🌿</span>
            </div>

            <div className="food-guide-calories">
              <strong>{food.calories}</strong>

              <span>kcal per 100 g</span>
            </div>

            <div className="food-guide-nutrients">
              <div>
                <span>Protein</span>
                <strong>{food.protein.toFixed(2)} g</strong>
              </div>

              <div>
                <span>Carbs</span>
                <strong>{food.carbs.toFixed(2)} g</strong>
              </div>

              <div>
                <span>Fat</span>
                <strong>{food.fat.toFixed(2)} g</strong>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredFoods.length === 0 && (
        <div className="food-guide-empty">
          <span>🔎</span>

          <h3>No foods found</h3>

          <p>Try another food name or select a different category.</p>
        </div>
      )}

      <p className="food-guide-disclaimer">
        Nutrition values are approximate reference values per 100 g.
        Actual values vary with food variety, preparation, and brand.
        These sample records should be checked against a reliable
        nutrition database before being used for research or health
        decisions.
      </p>
    </section>
  );
}

export default FoodGuide;   