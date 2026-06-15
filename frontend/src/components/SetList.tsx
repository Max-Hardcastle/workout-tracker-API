import type { ExerciseSet, Exercise } from "../types";

type SetListProps = {
  sets: ExerciseSet[];
  exercises: Exercise[];
  workout_id: number;
  deleteSet: (workout_id: number, set_id: number) => void;
  selectedSetId: number | null;
  setSelectedSetId: (set_id: number | null) => void;
  editSetNumber: string;
  setEditSetNumber: (editSetNumber: string) => void;
  editReps: string;
  setEditReps: (editReps: string) => void;
  editWeight: string;
  setEditWeight: (editWeight: string) => void;
  updateSet: (setId: number) => void;
};

function SetList({
  sets,
  exercises,
  workout_id,
  deleteSet,
  selectedSetId,
  setSelectedSetId,
  editSetNumber,
  setEditSetNumber,
  editReps,
  setEditReps,
  editWeight,
  setEditWeight,
  updateSet
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

            <button
              onClick={() => {
                setSelectedSetId(set.id);
                setEditSetNumber(String(set.set_number));
                setEditReps(String(set.reps));
                setEditWeight(String(set.weight));
              }}
              >
                Edit
              </button>
          
            <button onClick={() => deleteSet(set.workout_id, set.id)}>Delete</button>


            {selectedSetId === set.id && (
              <div>
                <input
                  type="number"
                  value={editSetNumber}
                  onChange={(e) => setEditSetNumber(e.target.value)}
                />

                <input
                  type="number"
                  value={editReps}
                  onChange={(e) => setEditReps(e.target.value)}
                />

                <input
                  type="number"
                  value={editWeight}
                  onChange={(e) => setEditWeight(e.target.value)}
                />

                <button onClick={() => updateSet(set.id)}>
                Update
                </button>
              
              </div>
              )}    
          </li>
          );
        })}
      </ul>
    </>
  );
}

  
export default SetList;