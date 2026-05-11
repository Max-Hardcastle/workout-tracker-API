import { useEffect, useState } from "react";
import type { Workout } from "../types";
import WorkoutList from "../components/WorkoutList"
import AddWorkoutForm from "../components/AddWorkoutForm";

function WorkoutsPage(){
    
    //States for the date of workouts being added
    const[workout_date, setDate] = useState("");

    //State for an empty set of workouts and how to add workouts to it
    const [workouts, setWorkouts] = useState<Workout[]>([]);

    //Async state for fetching workouts
    const fetchWorkouts = async() => {
    const res = await fetch("http://127.0.0.1:8000/workouts");
    const data = await res.json();
    
    setWorkouts(data);
    };

    //Async state for adding a new workout
    const addWorkout = async () => {
        await fetch("http://127.0.0.1:8000/workouts", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            workout_date
            })
        })

        //Reset date state back to blank
        setDate("");

        fetchWorkouts();
        };

    //Async state for deleting workouts
    const deleteWorkout = async (workout_id: number) => {
      await fetch(`http://127.0.0.1:8000/workouts/${workout_id}`, {
        method: "DELETE"
      });
      
      fetchWorkouts();
    };
    

    //Get workouts from backend, change them to json format, and add them to the set of workouts
    useEffect(() => {
    fetchWorkouts();
    }, []);

  return (
    <div>
      <WorkoutList
      workouts={workouts}
      deleteWorkout={deleteWorkout}
      />

      <h2>Add Workout</h2>

      <AddWorkoutForm
      setDate={setDate}
      workout_date={workout_date}
      addWorkout ={addWorkout}
      />
    </div>
  )
}

export default WorkoutsPage;
