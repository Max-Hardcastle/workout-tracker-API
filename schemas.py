from pydantic import BaseModel, Field, field_validator
from datetime import date
from typing import Optional

#'Exercise' standard schemas
class ExerciseCreate(BaseModel):
    name: str = Field(max_length=100)
    @field_validator("name")
    @classmethod
    def validate_name(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("exercise name cannot be empty.")
        
        return value


    description: str = Field(max_length=100)
    @field_validator("description")
    @classmethod
    def validate_description(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("description cannot be empty.")
        
        return value

class ExerciseRead(BaseModel):
    id: int
    name: str
    description: str

class ExerciseUpdate(ExerciseCreate):
    pass

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
    @field_validator("exercise_id")
    @classmethod
    def validate_exercise_id(cls, value):        
        if not value:
            raise ValueError("exercise cannot be blank.")
        
        return value
    
    set_number: int = Field(gt=0, le=100)

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