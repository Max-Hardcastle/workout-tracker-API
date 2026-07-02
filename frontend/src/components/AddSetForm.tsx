import type { Exercise } from "../types"

type AddSetFormProps = {
    exercises: Exercise[];
    exerciseId: string;
    setNumber: string;
    reps: string;
    weight: string;
    setExerciseId: React.Dispatch<React.SetStateAction<string>>;
    setReps: React.Dispatch<React.SetStateAction<string>>;
    setWeight: React.Dispatch<React.SetStateAction<string>>;
    addSet: () => void;
}

function AddSetForm({
    exercises,
    exerciseId,
    setNumber,
    reps,
    weight,
    setExerciseId,
    setReps,
    setWeight,
    addSet
}: AddSetFormProps){
        return(
        <div>
            <div className = "cardContent">
                <select
                value={exerciseId}
                onChange={(e) => setExerciseId(e.target.value)}
                >
                <option value="">Select exercise</option>

                {exercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                        {exercise.name}
                    </option>
                ))}
                </select>

                <input
                type="string"
                placeholder="Reps"
                value = {reps}
                onChange={(e) => setReps(e.target.value)}
                />

                <input
                type="string"
                placeholder="Weight (kg)"
                value = {weight}
                onChange={(e) => setWeight(e.target.value)}
                />
            </div>

            <div className = "cardActions">
                <button onClick={addSet}>Add Exercise Set</button> 
            </div>           
        </div>
        )

}

export default AddSetForm