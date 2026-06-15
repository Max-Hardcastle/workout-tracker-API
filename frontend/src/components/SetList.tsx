import type { ExerciseSet, Exercise } from "../types";

type SetListProps = {
  sets: ExerciseSet[];
  exercises: Exercise[];
  workout_id: number;
  deleteSet: (workout_id: number, set_id: number) => void;
};

function SetList({
  sets,
  exercises,
  workout_id,
  deleteSet
}: SetListProps){
  return (
    <>
    <h2>Workout {workout_id}</h2>
      <h3>Sets</h3>

        <ul>
          {sets.map((set) => {
            const exercise = exercises.find(
            (exercise) => exercise.id === set.exercise_id
          );

          return(
          <li key={set.id}>
            {exercise?.name}: Set no. {set.set_number} - {set.reps} reps at {set.weight}kg
            <button onClick={() => deleteSet(set.workout_id, set.id)}>Delete</button>
          </li>
          );
        })}
      </ul>
    </>
  );
}

  
export default SetList;