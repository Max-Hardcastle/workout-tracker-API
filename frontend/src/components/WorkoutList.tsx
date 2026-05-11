import type { Workout } from "../types";

type WorkoutListProps = {
  workouts: Workout[];
};

function WorkoutList({ workouts }: WorkoutListProps) {
  return (
    <>
      <h2>Workouts</h2>

      <ul>
        {workouts.map((wrk) => (
          <li key={wrk.id}>
            {wrk.id}: <strong>{wrk.workout_date}</strong>
            <button onClick={()=> console.log(wrk.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default WorkoutList;