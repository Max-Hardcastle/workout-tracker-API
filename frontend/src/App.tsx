import { useState } from "react";
import ExercisesPage from "./pages/ExercisesPage";
import WorkoutsPage from "./pages/WorkoutsPage";
import WorkoutDetailPage from "./pages/WorkoutDetailPage";

function App() {

  //Current page, default to workouts
  const [page, setPage] = useState("workouts");

  //Selected workout ID
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null);

  return (
    <div className="app-container">
      <h1>Workout Tracker</h1>

      <nav>
        <div className = "headerButtons">
          <button onClick={() => setPage("exercises")}>
            Exercises
          </button>

          <button onClick={() => setPage("workouts")}>
            Workouts
          </button>
        </div>
      </nav>

      {page === "exercises" && <ExercisesPage />}
      {page === "workouts" && selectedWorkoutId === null && (
        <WorkoutsPage setSelectedWorkoutId={setSelectedWorkoutId} />
      )}

      {page === "workouts" && selectedWorkoutId !== null && (
        <WorkoutDetailPage
        workoutId={selectedWorkoutId}
        goBack={() => setSelectedWorkoutId(null)}
      />
      )}

    </div>
  );
}

export default App;