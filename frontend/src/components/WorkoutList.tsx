import type { Workout } from "../types";

type WorkoutListProps = {
  workouts: Workout[];
  deleteWorkout: (workout_id: number) => void;
  setSelectedWorkoutId: (workout_id: number) => void;
};

function WorkoutList({
  workouts,
  deleteWorkout,
  setSelectedWorkoutId
}: WorkoutListProps) {
  return (
    <>
      <h2>Workouts</h2>

      <ul className = "list">
        {workouts.map((wrk) => (
          <li className = "card" key={wrk.id}>
            
            <div className = "cardContents">
              <strong>Workout: {wrk.workout_date}</strong>
            </div>

            <div className = "cardActions">
              <button onClick={() => setSelectedWorkoutId(wrk.id)}>Edit/View</button>
              <button
              className="deleteButton"
              onClick={() => deleteWorkout(wrk.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default WorkoutList;