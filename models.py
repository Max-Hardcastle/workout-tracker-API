from sqlmodel import SQLModel, Field
from datetime import date
from sqlalchemy import UniqueConstraint, Integer, Column

#Individual movements/exercises
class Exercise(SQLModel, table=True):
    __table_args__ = {"sqlite_autoincrement": True}
    
    id: int | None = Field(default=None, primary_key=True)
    name: str
    description: str

#Workouts
class Workout(SQLModel, table=True):
    __table_args__ = {"sqlite_autoincrement": True}

    id: int | None = Field(default=None, primary_key=True)
    workout_date: date


#Sets per exercise in a workout
class ExerciseSet(SQLModel, table=True):
    __table_args__ = (
        UniqueConstraint("workout_id", "exercise_id", "set_number"), #Prevents duplicate set numbers
        {"sqlite_autoincrement": True}
        )

    id: int | None = Field(
    default=None,
    sa_column=Column(Integer, primary_key=True, autoincrement=True)
    )

    workout_id: int = Field(foreign_key="workout.id")
    exercise_id: int = Field(foreign_key="exercise.id")
    set_number: int
    reps: int
    weight: float