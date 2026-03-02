from pydantic import BaseModel

class ExerciseBase(BaseModel):
    name: str
    description: str | None = None

class ExerciseRead(BaseModel):
    id: int
    name: str
    description: str | None = None

class ExerciseUpdate(BaseModel):
    name: str | None = None
    description: str | None = None