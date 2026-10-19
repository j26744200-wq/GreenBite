
import { useState } from "react";
import "./App.css";

import NutritionCalculator from "./NutritionCalculator";
import HydrationTracker from "./HydrationTracker";
import StepsTracker from "./StepsTracker";
import MealDiary from "./MealDiary";
import MealIdeas from "./MealIdeas";
import FoodGuide from "./FoodGuide";
import StudyTracker from "./StudyTracker";
import TodoList from "./TodoList";
import HabitGarden from "./HabitGarden";
import MoodGarden from "./MoodGarden";

const tools = [
  {
    id: "food-guide",
    title: "Food Guide",
    emoji: "🥗",
    description: "Explore food groups and learn about balanced meals.",
  },
  {
    id: "meal-diary",
    title: "Meal Diary",
    emoji: "📔",
    description: "Keep track of the meals you enjoy throughout your day.",
  },
  {
    id: "meal-ideas",
    title: "Meal Ideas",
    emoji: "🍓",
    description: "Discover delicious ideas for your next meal or snack.",
  },
  {
    id: "nutrition",
    title: "Nutrition Calculator",
    emoji: "🍎",
    description: "Explore nutrition information and your daily needs.",
  },
  {
    id: "hydration",
    title: "Hydration Tracker",
    emoji: "💧",
    description: "Build a refreshing hydration routine.",
  },
  {
    id: "steps",
    title: "Steps Tracker",
    emoji: "👟",
    description: "Keep track of your movement throughout the day.",
  },
  {
    id: "study",
    title: "Study Tracker",
    emoji: "📚",
    description: "Organize study sessions and celebrate your progress.",
  },
  {
    id: "todo",
    title: "To-Do List",
    emoji: "✅",
    description: "Organize tasks and make room for what matters.",
  },
  {
    id: "habits",
    title: "Habit Garden",
    emoji: "🌱",
    description: "Plant small habits and celebrate your daily progress.",
  },
  {
    id: "mood-garden",
    title: "Mood Garden",
    emoji: "🌷",
    description: "Check in with your feelings and grow your garden.",
  },
];

const pageComponents = {
  "food-guide": FoodGuide,
  "meal-diary": MealDiary,
  "meal-ideas": MealIdeas,
  nutrition: NutritionCalculator,
  hydration: HydrationTracker,
  steps: StepsTracker,
  study: StudyTracker,
  todo: TodoList,
  habits: HabitGarden,
  "mood-garden": MoodGarden,
};

function App() {
  const [activePage, setActivePage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigateTo = (page) => {
    setActivePage(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ActiveComponent = pageComponents[activePage];

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <button
            className="brand"
            onClick={() => navigateTo("home")}
            aria-label="Go to GreenBite home"
          >
            <span className="brand-icon">🌿</span>
            <span>GreenBite</span>
          </button>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          <nav
            id="main-navigation"
            className={`main-nav ${menuOpen ? "nav-open" : ""}`}
            aria-label="Main navigation"
          >
            <button
              className={`nav-link ${activePage === "home" ? "active" : ""}`}
              onClick={() => navigateTo("home")}
              aria-current={activePage === "home" ? "page" : undefined}
            >
              Home
            </button>

            {tools.map((tool) => (
              <button
                key={tool.id}
                className={`nav-link ${
                  activePage === tool.id ? "active" : ""
                }`}
                onClick={() => navigateTo(tool.id)}
                aria-current={activePage === tool.id ? "page" : undefined}
                title={tool.title}
              >
                <span className="nav-emoji" aria-hidden="true">
                  {tool.emoji}
                </span>
                <span>{tool.title}</span>
              </button>
            ))}
          </nav>

          <button
            className="header-cta"
            onClick={() => navigateTo("todo")}
          >
            My Tasks <span>↗</span>
          </button>
        </div>
      </header>

      <main>
        {activePage === "home" ? (
          <>
            <section className="hero">
              <div className="hero-content">
                <div className="eyebrow">
                  <span className="eyebrow-dot" />
                  YOUR LITTLE SPACE TO GROW
                </div>

                <h1>
                  Grow, Glow
                  <br />
                  <span>&amp; Go!</span> 🌱
                </h1>

                <p className="hero-description">
                  A little care every day goes a long way. Explore nourishing
                  food, build healthy routines, and make space for your
                  well-being — one small step at a time.
                </p>

                <div className="hero-actions">
                  <button
                    className="primary-button"
                    onClick={() => navigateTo("food-guide")}
                  >
                    Explore GreenBite <span>→</span>
                  </button>

                  <button
                    className="secondary-button"
                    onClick={() => navigateTo("habits")}
                  >
                    Grow a Habit 🌱
                  </button>
                </div>

                <div className="hero-note">
                  <span>✦</span> Small steps. Gentle progress. Your own pace.
                </div>
              </div>

              <div className="hero-art" aria-label="A peaceful garden">
                <div className="art-orbit orbit-one" />
                <div className="art-orbit orbit-two" />

                <div className="sun-circle">☀️</div>

                <div className="plant-illustration">
                  <span className="plant-sparkle sparkle-one">✦</span>
                  <span className="plant-sparkle sparkle-two">✧</span>
                  <span className="plant-leaf leaf-one">🌿</span>
                  <span className="plant-leaf leaf-two">🍃</span>
                  <span className="plant-main">🌱</span>
                  <span className="plant-pot">▰</span>
                </div>

                <div className="floating-card floating-card-top">
                  <span>🌷</span>
                  <div>
                    <strong>Keep growing</strong>
                    <small>One day at a time</small>
                  </div>
                </div>

                <div className="floating-card floating-card-bottom">
                  <span>💚</span>
                  <div>
                    <strong>You're doing great</strong>
                    <small>Celebrate little wins</small>
                  </div>
                </div>

                <span className="art-star star-one">✦</span>
                <span className="art-star star-two">✧</span>
                <span className="art-star star-three">✦</span>
              </div>
            </section>

            <section className="welcome-strip">
              <div className="welcome-icon">🌼</div>

              <div>
                <h2>A fresh start, whenever you need one.</h2>
                <p>
                  There is no perfect routine. Choose what feels helpful
                  today and let tomorrow be another opportunity to grow.
                </p>
              </div>

              <button
                className="text-button"
                onClick={() => navigateTo("mood-garden")}
              >
                Check in with yourself <span>→</span>
              </button>
            </section>

            <section className="features-section" id="features">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">
                    YOUR GROWING TOOLKIT
                  </span>

                  <h2>
                    Find your kind of <span>green.</span>
                  </h2>

                  <p>
                    Little tools to help you learn, plan, reflect, and grow.
                  </p>
                </div>

                <span className="section-flower">✿</span>
              </div>

              <div className="feature-grid">
                {tools.map((tool, index) => (
                  <button
                    className="feature-card"
                    key={tool.id}
                    onClick={() => navigateTo(tool.id)}
                    style={{ "--card-index": index }}
                  >
                    <div className="feature-card-top">
                      <span className="feature-emoji">{tool.emoji}</span>
                      <span className="feature-arrow">↗</span>
                    </div>

                    <h3>{tool.title}</h3>
                    <p>{tool.description}</p>

                    <span className="card-link">
                      Explore tool <span>→</span>
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="garden-banner">
              <div className="garden-banner-art">🌻</div>

              <div className="garden-banner-content">
                <span className="section-kicker">A MOMENT FOR YOU</span>

                <h2>
                  Your growth doesn't have to look like anyone else's.
                </h2>

                <p>
                  Celebrate what you can do, give yourself room to rest,
                  and remember that small things count too.
                </p>

                <button
                  className="primary-button"
                  onClick={() => navigateTo("mood-garden")}
                >
                  Visit Mood Garden <span>→</span>
                </button>
              </div>
            </section>
          </>
        ) : (
          <section className="tool-page">
            <div className="tool-page-top">
              <button
                className="back-button"
                onClick={() => navigateTo("home")}
              >
                ← Back to Home
              </button>

              <span className="tool-page-label">
                GREENBITE TOOLKIT <span>✦</span>
              </span>
            </div>

            {ActiveComponent ? (
              <ActiveComponent />
            ) : (
              <div className="not-found">
                <span>🌱</span>
                <h2>Let's get growing!</h2>
                <p>Choose a tool from the home page to get started.</p>

                <button
                  className="primary-button"
                  onClick={() => navigateTo("home")}
                >
                  Back Home →
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="site-footer">
        <button
          className="footer-brand"
          onClick={() => navigateTo("home")}
        >
          🌿 GreenBite
        </button>

        <p>Grow, Glow &amp; Go! — little steps, a little more green.</p>

        <button
          className="footer-link"
          onClick={() => navigateTo("mood-garden")}
        >
          Made with care 💚
        </button>

        <div className="footer-bottom">
          © {new Date().getFullYear()} GreenBite. Grow at your own pace.
        </div>
      </footer>
    </div>
  );
}

export default App;
