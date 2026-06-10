import type { ExerciseSet } from "../types";

type SetListProps = {
  sets: ExerciseSet[];
  workout_id: number;
  deleteSet: (workout_id: number, set_id: number) => void;
};

function SetList({
  sets,
  workout_id,
  deleteSet
}: SetListProps){
  return (
    <>
    <h2>Workout {workout_id}</h2>
      <h3>Sets</h3>
        <ul>
        {sets.map((set) => (
          <li key={set.id}>
            Exercise {set.exercise_id}: Set no. {set.set_number} - {set.reps} reps at {set.weight}kg
            <button onClick={() => deleteSet(set.workout_id, set.id)}>Delete</button>
          </li>
        ))}
        </ul>
    </>
  );
}

export default SetList;