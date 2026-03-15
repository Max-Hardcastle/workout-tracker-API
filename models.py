<<<<<<< HEAD
from sqlmodel import SQLModel, Field

class Exercise(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
=======
from pydantic import BaseModel

class ExerciseBase(BaseModel):
    name: str
    description: str

class Exercise(ExerciseBase):
    id: int

class ExerciseUpdate(BaseModel):
    name: str | None = None
>>>>>>> 403a35f1a197f8e30e876d7783481c8e04cdb808
    description: str | None = None