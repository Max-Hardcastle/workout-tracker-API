type AddExerciseFormProps = {
    name: string;
    description: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    addExercise: () => void;
}


function AddExerciseForm({
    name,
    description,
    setName,
    setDescription,
    addExercise
}: AddExerciseFormProps){
    return(
        <div>
            <div className = "cardContent">

                <input
                type="text"
                placeholder="Exercise name"
                value = {name}
                onChange={(e) => setName(e.target.value)}
                />

                <textarea
                className = "largeInput"
                placeholder="Description"
                value = {description}
                onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className = "cardActions">
                <button onClick={addExercise}>Add Exercise</button>        
            </div>    
        </div>
        )
}

export default AddExerciseForm