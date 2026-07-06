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

    //Error state for functions in this page
    const [error, setError] = useState("");

    //Async state for fetching exercises
    const fetchExercises = async() => {
      const res = await fetch("http://127.0.0.1:8000/exercises");

      //Error checking, display backend message or generic error
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.detail?.[0]?.msg || "Could not load exercises");
        return;
      }

      const data = await res.json();
      setExercises(data);

      setError("")
    };

    //Async state for adding a new exercise
    const addExercise = async () => {
        const res = await fetch("http://127.0.0.1:8000/exercises", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            name,
            description
            })
        })

        //Error checking, display backend message or generic error
        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.detail?.[0]?.msg || "Could not add exercise");
          return;
        }

        //Reset name and description states back to blank
        setName("");
        setDescription("");

        fetchExercises();

        setError("")
    }

    //Async state for deleting exercises
    const deleteExercise = async (exercise_id: number) => {
      const res = await fetch(`http://127.0.0.1:8000/exercises/${exercise_id}`, {
        method: "DELETE"
      });

      //Error checking, display backend message or generic error
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.detail?.[0]?.msg || "Could not delete exercise");
        return;
      }
      
      fetchExercises();
      setError("");
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

  //Asnc state for editing exercises
  const updateExercise = async (exerciseId: number) => {
      const res = await fetch(`http://127.0.0.1:8000/exercises/${exerciseId}`, {
      method: "PATCH",
      headers: {
      "Content-Type": "application/json",
    },
      body: JSON.stringify({
      name: String(editExerciseName),
      description: String(editExerciseDescription),
    }),
  });

      //Error checking, display backend message or generic error
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.detail?.[0]?.msg || "Could not edit exercise");
        return;
      }

  fetchExercises();
  setSelectedExerciseId(null);

  setError("")
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

      <div className = "error">
        {error && <p>{error}</p>}
      </div>

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
