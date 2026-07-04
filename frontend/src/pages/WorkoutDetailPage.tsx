import { useState, useEffect } from "react";
import type { Exercise, ExerciseSet } from "../types";
import AddSetForm from "../components/AddSetForm";
import SetList from "../components/SetList";

type WorkoutDetailPageProps = {
  workoutId: number;
  goBack: () => void;
};

function WorkoutDetailPage({workoutId, goBack}: WorkoutDetailPageProps){

  //States for the properties of sets
  const[exercise_id, setExerciseId] = useState("");
  const[set_number, setSetNumber] = useState("");
  const[reps, setReps] = useState("");
  const[weight, setWeight] = useState("");
  
  //State for an empty set of exercise sets and how to add exercise sets to it
  const[exerciseSets, setExerciseSets] = useState<ExerciseSet[]>([]);

  //State for an empty set of exercises and how to add exercises to it
  const [exercises, setExercises] = useState<Exercise[]>([]);

  //Error state for functions in this page
  const [error, setError] = useState("");

  //Async state for fetching exercises
  const fetchExercises = async() => {
    const res = await fetch("http://127.0.0.1:8000/exercises");

    //Error checking, display message if error
    if (!res.ok) {
      setError("Could not load exercises");
      return;
    }
    
    const data = await res.json();
    setExercises(data);

    setError("");
  };

  //Async state for fetching exercise sets
  const fetchExerciseSets = async() => {
    const res = await fetch(`http://127.0.0.1:8000/workouts/${workoutId}/sets`);
    
    //Error checking, display message if error
    if (!res.ok) {
      setError("Could not load sets");
      return;
    }

    const data = await res.json();
    setExerciseSets(data);

    setError("")
  };



  //Async state for adding a new workout set
  const addWorkoutSet = async () => {

    //Filter for all sets for this exercise
    const setsForThisExercise = exerciseSets.filter(
      (set) => set.exercise_id === Number(exercise_id)
    );

    //Calculate +1 of the highest existing set, unless there are no sets, then next set number is 1
    const nextSetNumber = 
      setsForThisExercise.length === 0 ? 1
      : Math.max(...setsForThisExercise.map((set) => set.set_number)) + 1;

    const res = await fetch(`http://127.0.0.1:8000/workouts/${workoutId}/sets`, {
    method: "POST",
    headers: {
    "Content-Type": "application/json"
    },
    body: JSON.stringify({
      exercise_id: Number(exercise_id),
      set_number: Number(nextSetNumber),
      reps: Number(reps),
      weight: Number(weight)
    })
  })

  //Error checking, display message if error
  if (!res.ok) {
  setError("Something went wrong adding this set.");
  return;
  }
  
  //Reset states back to blank
  setError("");
  setExerciseId("");
  setSetNumber("");
  setReps("");
  setWeight("");

  fetchExerciseSets();
};

  //Async state for deleting sets
  const deleteSet = async (workout_id: number, exercise_set_id: number) => {
    const res = await fetch(`http://127.0.0.1:8000/workouts/${workout_id}/sets/${exercise_set_id}`, {
      method: "DELETE"
    });

    //Error checking, display message if error
    if (!res.ok) {
    setError("Something went wrong deleting this set.");
    return;
    }
  
    fetchExerciseSets();
  };

  //State for selecting set ID for editing set
  const [selectedSetId, setSelectedSetId] = useState<number | null>(null);

  const[editReps, setEditReps] = useState("");
  const[editWeight, setEditWeight] = useState("");

  //Asnc state for editing sets
  const updateSet = async (setId: number) => {
      const res = await fetch(`http://127.0.0.1:8000/workouts/${workoutId}/sets/${setId}`, {
      method: "PATCH",
      headers: {
      "Content-Type": "application/json",
    },
      body: JSON.stringify({
      reps: Number(editReps),
      weight: Number(editWeight),
    }),
  });

      //Error checking, display message if error
      if (!res.ok) {
      setError("Something went wrong when editing this set.");
      return;
      }

      fetchExerciseSets();
      setSelectedSetId(null);

      setError("")
};

  useEffect(() => {
    fetchExerciseSets();
    fetchExercises();
  }, [workoutId]);

    return (
    <div>
        <SetList
        exercises={exercises}
        sets={exerciseSets}
        workout_id={workoutId}
        deleteSet={deleteSet}
        selectedSetId={selectedSetId}
        setSelectedSetId={setSelectedSetId}
        editReps={editReps}
        setEditReps={setEditReps}
        editWeight={editWeight}
        setEditWeight={setEditWeight}
        updateSet={updateSet}
        />
        
        {error && <p>{error}</p>}

        <h2>Add Set</h2>

        <AddSetForm
        exercises={exercises}
        exerciseId={exercise_id}
        setNumber={set_number}
        reps={reps}
        weight={weight}
        addSet ={addWorkoutSet}
        setExerciseId={setExerciseId}
        setReps={setReps}
        setWeight={setWeight}
        />

        <div className = "cardActions">
          <button onClick={goBack}>Back to workouts</button>
        </div>
    </div>
  );
}

export default WorkoutDetailPage