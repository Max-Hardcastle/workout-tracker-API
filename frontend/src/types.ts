//Define what makes up an exercise
export type Exercise = {
  id: number;
  name: string;
  description: string;
};

//Define what makes up a workout
export type Workout = {
  id: number;
  workout_date: string;
};

//Define a set within a workout
export type ExerciseSet = {
  id: number;
  workout_id: number;
  exercise_id: number;
  set_number: number;
  reps: number;
  weight: number;
};