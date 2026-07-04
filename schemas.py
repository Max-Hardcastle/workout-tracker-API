from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

#'Exercise' standard schemas
class ExerciseCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str = Field(min_length=1, max_length=100)

class ExerciseRead(BaseModel):
    id: int
    name: str
    description: str

class ExerciseUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str = Field(min_length=1, max_length=100)


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

    reps: int = Field(gt=0, le=100)
    weight: float = Field(ge=0, le=1000)

class ExerciseSetRead(BaseModel):
    id: int
    workout_id: int
    exercise_id: int
    set_number: int
    reps: int
    weight: float

class ExerciseSetUpdate(BaseModel):
    reps: int = Field(gt=0, le=100)
    weight: float = Field(ge=0, le=1000)