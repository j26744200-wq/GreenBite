
import { useMemo, useState } from 'react';
import './MealIdeas.css';

const mealIdeas = [
  {
    id: 1,
    name: 'Oatmeal with Banana',
    category: 'Breakfast',
    time: 10,
    emoji: '🥣',
    description: 'A simple breakfast made with oats and banana.',
    ingredients: ['Oats', 'Milk or water', 'Banana'],
    instructions: [
      'Cook the oats in milk or water.',
      'Slice the banana.',
      'Add the banana to the cooked oats and serve.',
    ],
  },
  {
    id: 2,
    name: 'Vegetable Poha',
    category: 'Breakfast',
    time: 20,
    emoji: '🍋',
    description: 'A light Indian breakfast with flattened rice and vegetables.',
    ingredients: ['Poha', 'Onion', 'Peas', 'Carrot', 'Oil', 'Lemon'],
    instructions: [
      'Rinse the poha gently and drain it.',
      'Cook the onion and vegetables in a little oil.',
      'Add the poha and mix until heated.',
      'Finish with lemon juice.',
    ],
  },
  {
    id: 3,
    name: 'Sprouts Salad',
    category: 'Breakfast',
    time: 10,
    emoji: '🥗',
    description: 'A refreshing salad made with cooked sprouts and vegetables.',
    ingredients: ['Cooked sprouts', 'Tomato', 'Cucumber', 'Lemon'],
    instructions: [
      'Make sure the sprouts are thoroughly cooked and cooled.',
      'Chop the vegetables.',
      'Combine everything and add lemon juice.',
    ],
  },
  {
    id: 4,
    name: 'Vegetable Khichdi',
    category: 'Lunch',
    time: 30,
    emoji: '🍲',
    description: 'A comforting one-pot meal of rice, lentils, and vegetables.',
    ingredients: ['Rice', 'Moong dal', 'Carrot', 'Peas', 'Water', 'Spices'],
    instructions: [
      'Rinse the rice and dal.',
      'Add them to a pot with vegetables, water, and spices.',
      'Cook until the rice, lentils, and vegetables are soft.',
    ],
  },
  {
    id: 5,
    name: 'Chickpea Salad',
    category: 'Lunch',
    time: 15,
    emoji: '🥙',
    description: 'A filling salad with chickpeas and fresh vegetables.',
    ingredients: ['Cooked chickpeas', 'Cucumber', 'Tomato', 'Onion', 'Lemon'],
    instructions: [
      'Drain and rinse the cooked chickpeas.',
      'Chop the vegetables.',
      'Mix everything together with lemon juice.',
    ],
  },
  {
    id: 6,
    name: 'Paneer Vegetable Wrap',
    category: 'Lunch',
    time: 20,
    emoji: '🌯',
    description: 'Paneer and vegetables wrapped in a flatbread.',
    ingredients: ['Paneer', 'Roti', 'Capsicum', 'Onion', 'Spices'],
    instructions: [
      'Cut the paneer and vegetables into small pieces.',
      'Cook them together with your preferred spices.',
      'Place the filling inside a roti and roll it.',
    ],
  },
  {
   id: 8,
   name: 'Dal Chawal',
   category: 'Dinner',
   time: 30,
   emoji: '🍛',
   description: 'A comforting Indian meal of seasoned lentils served with steamed rice.',
   ingredients: ['Lentils', 'Rice', 'Water', 'Spices', 'Salt', 'Ghee'],
   instructions: [
     'Wash the lentils and cook them with water until soft.',
     'Add salt and spices, then simmer the dal until flavorful.',
     'Wash the rice and cook it in water until fluffy.',
     'Serve the hot dal with steamed rice.',
   ],
  },
  {
    id: 8,
    name: 'Vegetable Stir-Fry',
    category: 'Dinner',
    time: 20,
    emoji: '🥦',
    description: 'A quick meal of cooked vegetables with rice or noodles.',
    ingredients: ['Broccoli', 'Carrot', 'Capsicum', 'Oil', 'Seasoning'],
    instructions: [
      'Wash and chop the vegetables.',
      'Cook them in a pan until tender but still firm.',
      'Season and serve with rice or noodles.',
    ],
  }, 
  {
    id: 9,
    name: 'Paneer Bhurji',
    category: 'Dinner',
    time: 20,
    emoji: '🍛',
    description: 'Crumbled paneer cooked with onion, tomato, and spices.',
    ingredients: ['Paneer', 'Onion', 'Tomato', 'Spices', 'Oil'],
    instructions: [
      'Crumble the paneer.',
      'Cook onion and tomato with spices.',
      'Add the paneer and cook for several minutes.',
      'Serve with roti or rice.',
    ],
  },
  {
    id: 10,
    name: 'Fruit and Yogurt Bowl',
    category: 'Snack',
    time: 5,
    emoji: '🍓',
    description: 'Yogurt served with fresh fruit.',
    ingredients: ['Plain yogurt', 'Apple', 'Banana', 'Seasonal fruit'],
    instructions: [
      'Wash and cut the fruit.',
      'Place the yogurt in a bowl.',
      'Add the fruit and serve.',
    ],
  },
  {
    id: 11,
    name: 'Roasted Chickpeas',
    category: 'Snack',
    time: 30,
    emoji: '🟤',
    description: 'Crunchy chickpeas seasoned and roasted in the oven.',
    ingredients: ['Cooked chickpeas', 'Oil', 'Seasoning'],
    instructions: [
      'Drain the cooked chickpeas and pat them dry.',
      'Toss with a small amount of oil and seasoning.',
      'Roast until crisp, checking regularly.',
    ],
  },
  {
    id: 12,
    name: 'Besan Chilla',
    category: 'Breakfast',
    time: 15,
    emoji: '🥞',
    description: 'Savory gram-flour pancakes made with vegetables and spices.',
    ingredients: [
      'Besan',
      'Onion',
      'Tomato',
      'Green Chilli',
      'Coriander Leaves',
      'Turmeric',
      'Salt',
      'Water',
      'Oil',
    ],
    instructions: [
      'Add besan, turmeric, salt, and water to a bowl.',
      'Mix well to make a smooth batter without lumps.',
      'Add chopped onion, tomato, green chilli, and coriander leaves.',
      'Heat a pan and lightly grease it with oil.',
      'Pour the batter onto the pan and spread it into a thin circle.',
      'Cook until the bottom is golden, then flip and cook the other side.',
      'Serve hot with green chutney or tomato ketchup.',
    ],
  },
];

const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];

function MealIdeas() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedMeal, setSelectedMeal] = useState(null);

  const filteredMeals = useMemo(() => {
    const term = search.trim().toLowerCase();

    return mealIdeas.filter((meal) => {
      const matchesSearch =
        meal.name.toLowerCase().includes(term) ||
        meal.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(term)
        );

      const matchesCategory =
        category === 'All' || meal.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <section className="meal-ideas">
      <div className="meal-ideas-heading">
        <span className="meal-ideas-icon">🍽️</span>

        <div>
          <span className="meal-ideas-eyebrow">
            FIND YOUR NEXT MEAL
          </span>

          <h2>Meal Ideas</h2>

          <p>
            Explore simple meal suggestions, ingredients, and
            preparation steps.
          </p>
        </div>
      </div>

      <div className="meal-ideas-filters">
        <label className="meal-ideas-search">
          <span>🔍</span>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search meals or ingredients..."
            aria-label="Search meals or ingredients"
          />
        </label>

        <label>
          Meal

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

      <p className="meal-ideas-count">
        Showing {filteredMeals.length} of {mealIdeas.length} meal ideas
      </p>

      <div className="meal-ideas-grid">
        {filteredMeals.map((meal) => (
          <article className="meal-idea-card" key={meal.id}>
            <div className="meal-idea-card-top">
              <span className="meal-idea-emoji">
                {meal.emoji}
              </span>

              <span className="meal-idea-time">
                ⏱️ {meal.time} min
              </span>
            </div>

            <div className="meal-idea-tags">
              <span>{meal.category}</span>
            </div>

            <h3>{meal.name}</h3>

            <p>{meal.description}</p>

            <button
              type="button"
              className="meal-idea-details-button"
              onClick={() => setSelectedMeal(meal)}
            >
              View recipe →
            </button>
          </article>
        ))}
      </div>

      {filteredMeals.length === 0 && (
        <div className="meal-ideas-empty">
          <span>🔎</span>
          <h3>No meal ideas found</h3>
          <p>Try another search or change your filters.</p>
        </div>
      )}

      {selectedMeal && (
        <div
          className="meal-ideas-overlay"
          onClick={() => setSelectedMeal(null)}
        >
          <section
            className="meal-ideas-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="meal-ideas-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="meal-ideas-close"
              onClick={() => setSelectedMeal(null)}
              aria-label="Close recipe"
            >
              ×
            </button>

            <span className="meal-ideas-eyebrow">
              {selectedMeal.category.toUpperCase()} RECIPE
            </span>

            <h3 id="meal-ideas-modal-title">
              {selectedMeal.emoji} {selectedMeal.name}
            </h3>

            <p className="meal-ideas-modal-description">
              {selectedMeal.description}
            </p>

            <p className="meal-ideas-modal-meta">
              ⏱️ Approximately {selectedMeal.time} minutes
            </p>

            <h4>Ingredients</h4>

            <ul className="meal-ideas-ingredients">
              {selectedMeal.ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>

            <h4>Preparation</h4>

            <ol className="meal-ideas-instructions">
              {selectedMeal.instructions.map((instruction, index) => (
                <li key={`${selectedMeal.id}-${index}`}>
                  {instruction}
                </li>
              ))}
            </ol>

            <p className="meal-ideas-note">
              Preparation times are estimates. Cooking times and
              results may vary depending on equipment, ingredients,
              and portion size.
            </p>
          </section>
        </div>
      )}
    </section>
  );
}

export default MealIdeas;
