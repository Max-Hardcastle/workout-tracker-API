import { useState } from "react";
import ExercisesPage from "./pages/ExercisesPage";
import WorkoutsPage from "./pages/WorkoutsPage";

function App() {

  //Current page, default to workouts
  const [page, setPage] = useState("workouts");

  return (
    <div>
      <h1>Workout Tracker</h1>

      <nav>
        <button onClick={() => setPage("exercises")}>
          Exercises
        </button>

        <button onClick={() => setPage("workouts")}>
          Workouts
        </button>
      </nav>

      {page === "exercises" && <ExercisesPage />}
      {page === "workouts" && <WorkoutsPage />}
    </div>
  );
}

export default App;