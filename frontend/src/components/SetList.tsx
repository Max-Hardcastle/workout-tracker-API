import type { ExerciseSet, Exercise } from "../types";

type SetListProps = {
  sets: ExerciseSet[];
  exercises: Exercise[];
  workout_id: number;
  deleteSet: (workout_id: number, set_id: number) => void;
  selectedSetId: number | null;
  setSelectedSetId: (set_id: number | null) => void;
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

        <ul className = "list">
          {sets.map((set) => {
            const exercise = exercises.find(
            (exercise) => exercise.id === set.exercise_id
          );

          return(
          <li className = "card" key={set.id}>

            <div className = "cardContents">
              {exercise?.name}: {set.reps} reps at {set.weight}kg
            </div>

            <div className = "cardActions">
              <button
                onClick={() => {
                  setSelectedSetId(set.id);
                  setEditReps(String(set.reps));
                  setEditWeight(String(set.weight));
                }}
                >
                  Edit
                </button>
            
              <button onClick={() => deleteSet(set.workout_id, set.id)}>Delete</button>
            </div>


            {selectedSetId === set.id && (
              <div>
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