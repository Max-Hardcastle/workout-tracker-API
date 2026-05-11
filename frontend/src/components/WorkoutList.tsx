import type { Workout } from "../types";

type WorkoutListProps = {
  workouts: Workout[];
  deleteWorkout: (workout_id: number) => void;
};

function WorkoutList({
  workouts,
  deleteWorkout
}: WorkoutListProps) {
  return (
    <>
      <h2>Workouts</h2>

      <ul>
        {workouts.map((wrk) => (
          <li key={wrk.id}>
            Workout {wrk.id}: <strong>{wrk.workout_date}</strong>
            <button>Edit</button>
            <button onClick={() => deleteWorkout(wrk.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default WorkoutList;