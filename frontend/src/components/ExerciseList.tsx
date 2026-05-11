import type { Exercise } from "../types";

type ExerciseListProps = {
  exercises: Exercise[];
  deleteExercise: (exercise_id: number) => void;
};

function ExerciseList({
    exercises,
    deleteExercise
}: ExerciseListProps){
  return (
    <>
      <h2>Exercises</h2>

      <ul>
        {exercises.map((ex) => (
          <li key={ex.id}>
            {ex.id}: <strong>{ex.name}</strong> - {ex.description}
            <button onClick={() => deleteExercise(ex.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ExerciseList;