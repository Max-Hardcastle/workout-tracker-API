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

  //Async state for fetching exercises
  const fetchExercises = async() => {
    const res = await fetch("http://127.0.0.1:8000/exercises");
    const data = await res.json();
    setExercises(data);
  };

  //Async state for fetching exercise sets
  const fetchExerciseSets = async() => {
    const res = await fetch(`http://127.0.0.1:8000/workouts/${workoutId}/sets`);
    const data = await res.json();
    setExerciseSets(data);
  };

  //Async state for adding a new workout set
  const addWorkoutSet = async () => {
    await fetch(`http://127.0.0.1:8000/workouts/${workoutId}/sets`, {
    method: "POST",
    headers: {
    "Content-Type": "application/json"
    },
    body: JSON.stringify({
      exercise_id: Number(exercise_id),
      set_number: Number(set_number),
      reps: Number(reps),
      weight: Number(weight)
    })
  })
  
  //Reset states back to blank
  setExerciseId("");
  setSetNumber("");
  setReps("");
  setWeight("");

  fetchExerciseSets();
};

  //Async state for deleting sets
  const deleteSet = async (workout_id: number, exercise_set_id: number) => {
    await fetch(`http://127.0.0.1:8000/workouts/${workout_id}/sets/${exercise_set_id}`, {
      method: "DELETE"
    });
    
    fetchExerciseSets();
  };

  useEffect(() => {
    fetchExerciseSets();
    fetchExercises();
  }, [workoutId]);

    return (
    <div>
        <SetList
        sets={exerciseSets}
        workout_id={workoutId}
        deleteSet={deleteSet}
        />

        <AddSetForm
        exercises={exercises}
        exerciseId={exercise_id}
        setNumber={set_number}
        reps={reps}
        weight={weight}
        addSet ={addWorkoutSet}
        setExerciseId={setExerciseId}
        setSetNumber={setSetNumber}
        setReps={setReps}
        setWeight={setWeight}
        />

        <button onClick={goBack}>Back to workouts</button>
    </div>
  );
}

export default WorkoutDetailPage