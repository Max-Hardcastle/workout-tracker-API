import { useEffect, useState } from "react";
import type { Workout } from "../types";
import WorkoutList from "../components/WorkoutList"
import AddWorkoutForm from "../components/AddWorkoutForm";

type workoutsPageProps = {
  setSelectedWorkoutId: React.Dispatch<React.SetStateAction<number | null>>;
};

function WorkoutsPage({ setSelectedWorkoutId }: workoutsPageProps){
    
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

    //Error state for functions in this page
    const [error, setError] = useState("");

    //Async state for adding a new workout
    const addWorkout = async () => {
        const res = await fetch("http://127.0.0.1:8000/workouts", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            workout_date
            })
        })

        //Error checking, display message if error
        if (!res.ok) {
        setError("Something went wrong when adding this workout.");
        return;
        }

        //Reset date state back to blank
        setDate("");

        fetchWorkouts();
        setError("")
        };

    //Async state for deleting workouts
    const deleteWorkout = async (workout_id: number) => {
      const res = await fetch(`http://127.0.0.1:8000/workouts/${workout_id}`, {
        method: "DELETE"
      });

      //Error checking, display message if error
      if (!res.ok) {
      setError("Something went wrong when deleting this workout.");
      return;
      }
      
      fetchWorkouts();
      setError("")
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
      setSelectedWorkoutId={setSelectedWorkoutId}
      />

      {error && <p>{error}</p>}

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
