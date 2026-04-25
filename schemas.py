from pydantic import BaseModel
from datetime import date

#'Exercise' standard schemas
class ExerciseBase(BaseModel):
    name: str
    description: str | None = None

class ExerciseRead(ExerciseBase):
    id: int

class ExerciseUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


#'Workout' standard schemas
class WorkoutCreate(BaseModel):
    workout_date: date

class WorkoutRead(BaseModel):
    id: int
    workout_date: date

class WorkoutUpdate(BaseModel):
    workout_date: date | None = None


#Workout/Exercise interaction schemas
class ExerciseSetCreate(BaseModel):
    exercise_id: int
    set_number: int
    reps: int
    weight: float

class ExerciseSetRead(BaseModel):
    id: int
    workout_id: int
    exercise_id: int
    set_number: int
    reps: int
    weight: float