from sqlmodel import SQLModel, Field
from datetime import date

#Individual movements/exercises
class Exercise(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    description: str

#Workouts
class Workout(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    workout_date: date


#Sets per exercise in a workout
class ExerciseSet(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    workout_id: int = Field(foreign_key="workout.id")
    exercise_id: int = Field(foreign_key="exercise.id")
    set_number: int
    reps: int
    weight: float