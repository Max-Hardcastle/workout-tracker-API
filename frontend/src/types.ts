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