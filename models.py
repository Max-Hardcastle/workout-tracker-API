from pydantic import BaseModel

class ExerciseBase(BaseModel):
    name: str
    description: str

class Exercise(ExerciseBase):
    id: int

class ExerciseUpdate(BaseModel):
    name: str | None = None
    description: str | None = None