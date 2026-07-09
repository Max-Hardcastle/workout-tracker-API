import type { ExerciseSet, Exercise } from "../types";

type SetListProps = {
  workoutDate: string;
  sets: ExerciseSet[];
  exercises: Exercise[];
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
  workoutDate,
  sets,
  exercises,
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
    <h2>Workout {workoutDate}</h2>
      <h3>Sets</h3>

        <ul className = "list">
          {sets.map((set) => {
            const exercise = exercises.find(
            (exercise) => exercise.id === set.exercise_id
          );

          return(
          <li className = "card" key={set.id}>

            <div className = "cardContent">
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
            
              <button
              className="deleteButton"
              onClick={() => deleteSet(set.workout_id, set.id)}>Delete</button>
            </div>

            {selectedSetId === set.id && (
              <div>
                <div className = "editCardContent">
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
                </div>

                <div className = "cardActions">
                  <button onClick={() => updateSet(set.id)}>
                    Update
                  </button>
                </div>
              
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