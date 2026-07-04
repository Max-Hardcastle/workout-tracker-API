import type { Exercise } from "../types";

type ExerciseListProps = {
  exercises: Exercise[];
  deleteExercise: (exercise_id: number) => void;

  selectedExerciseId: number | null;
  setSelectedExerciseId: (selectedExerciseId: number | null) => void;

  editExerciseName: string;
  setEditExerciseName: (editExerciseName: string) => void;
  
  editExerciseDescription: string;
  setEditExerciseDescription: (editExerciseDescription: string) => void;

  updateExercise: (exerciseId: number) => void;
};

function ExerciseList({
    exercises,
    deleteExercise,
    selectedExerciseId,
    setSelectedExerciseId,
    editExerciseName,
    setEditExerciseName,
    editExerciseDescription,
    setEditExerciseDescription,
    updateExercise
}: ExerciseListProps){
  return (
    <>
      <h2>Exercises</h2>

      <ul className = "list">
        {exercises.map((ex) => (
          <li className = "card" key={ex.id}>

            <div className = "cardContent">
              <strong>{ex.name}</strong>{ex.description}
            </div>

            <div className = "cardActions">
              
              <button
                onClick={() => {
                  setSelectedExerciseId(ex.id);
                  setEditExerciseName(String(ex.name));
                  setEditExerciseDescription(String(ex.description));
                }}
                >
                  Edit
              </button>
              
              <button
              className="deleteButton"
              onClick={() => deleteExercise(ex.id)}>Delete</button>
            </div>

            {selectedExerciseId === ex.id && (
              <div>
                <div className = "editCardContent">
                  <input
                    type="string"
                    value={editExerciseName}
                    onChange={(e) => setEditExerciseName(e.target.value)}
                  />

                  <input
                    type="string"
                    value={editExerciseDescription}
                    onChange={(e) => setEditExerciseDescription(e.target.value)}
                  />
                </div>

                <div className = "cardActions">
                  <button onClick={() => updateExercise(ex.id)}>
                    Update
                  </button>

                  <button onClick={() => {setSelectedExerciseId(null)}}>
                    Cancel
                  </button>

                </div>

              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ExerciseList;