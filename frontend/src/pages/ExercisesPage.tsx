import { useEffect, useState } from "react";
import type { Exercise } from "../types";
import ExerciseList from "../components/ExerciseList"
import AddExerciseForm from "../components/AddExerciseForm";

function ExercisesPage(){
    //States for the name and description of exercises being added
    const[name, setName] = useState("");
    const[description, setDescription] = useState("");

    //State for an empty set of exercises and how to add exercises to it
    const [exercises, setExercises] = useState<Exercise[]>([]);

    //Async state for fetching exercises
    const fetchExercises = async() => {
      const res = await fetch("http://127.0.0.1:8000/exercises");
      const data = await res.json();
      setExercises(data);
    };

    //Async state for adding a new exercise
    const addExercise = async () => {
        await fetch("http://127.0.0.1:8000/exercises", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            name,
            description
            })
        })

        //Reset name and description states back to blank
        setName("");
        setDescription("");

        fetchExercises();
    }

    //Async state for deleting exercises
    const deleteExercise = async (exercise_id: number) => {
      await fetch(`http://127.0.0.1:8000/exercises/${exercise_id}`, {
        method: "DELETE"
      });
      
      fetchExercises();
    };

    //Get exercises from backend, change them to json format, and add them to the set of exercises
    useEffect(() => {
    fetchExercises();
    }, []);

  //State for selecting set ID for editing exercises
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);

  //States for temporary editing components
  const[editExerciseName, setEditExerciseName] = useState("");
  const[editExerciseDescription, setEditExerciseDescription] = useState("");

  //Asnc state for editing sets
  const updateExercise = async (exerciseId: number) => {
      await fetch(`http://127.0.0.1:8000/exercises/${exerciseId}`, {
      method: "PATCH",
      headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: String(editExerciseName),
      description: String(editExerciseDescription),
    }),
  });

  fetchExercises();
  setSelectedExerciseId(null);
};

  return (
    <div>
      <ExerciseList
      exercises={exercises}
      deleteExercise={deleteExercise}
      selectedExerciseId={selectedExerciseId}
      setSelectedExerciseId={setSelectedExerciseId}
      editExerciseName={editExerciseName}
      setEditExerciseName={setEditExerciseName}
      editExerciseDescription={editExerciseDescription}
      setEditExerciseDescription={setEditExerciseDescription}
      updateExercise={updateExercise}
      />

      <h2>Add Exercise</h2>

      <AddExerciseForm
      name={name}
      description={description}
      setName={setName}
      setDescription={setDescription}
      addExercise ={addExercise}
      />

    </div>
  )
}

export default ExercisesPage;
