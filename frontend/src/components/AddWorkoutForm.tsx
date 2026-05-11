type AddWorkoutFormProps = {
    workout_date: string;
    addWorkout: () => void;
    setDate: React.Dispatch<React.SetStateAction<string>>;
}

function AddWorkoutForm({
    workout_date,
    setDate,
    addWorkout
}: AddWorkoutFormProps){
    return(
        <div>
            <input
            type="text"
            placeholder="Date of workout"
            value = {workout_date}
            onChange={(e) => setDate(e.target.value)}
            />
            <button onClick={addWorkout}>Add Workout</button>
        </div>
        )
}

export default AddWorkoutForm