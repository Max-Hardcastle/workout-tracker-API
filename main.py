from fastapi import FastAPI, Depends, HTTPException
from schemas import ExerciseBase, ExerciseRead, ExerciseUpdate
from contextlib import asynccontextmanager
from database import create_db_and_tables
from sqlmodel import Session, select
from database import get_session
from models import Exercise

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/")
def root():
    return {"message": "Server running"}

@app.get("/exercises", response_model=list[ExerciseRead])
def get_exercises(session: Session = Depends(get_session)):
    return session.exec(select(Exercise)).all()


@app.get("/exercises/{exercise_id}", response_model=ExerciseRead)
def get_exercise(exercise_id: int, session: Session = Depends(get_session)):
    exercise = session.get(Exercise, exercise_id)

    if exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    return exercise

@app.post("/exercises", response_model=ExerciseRead, status_code=201)
def create_exercise(ex: ExerciseBase, session: Session = Depends(get_session)):
    db_ex = Exercise(**ex.model_dump())
    session.add(db_ex)
    session.commit()
    session.refresh(db_ex)
    return db_ex

@app.patch("/exercises/{exercise_id}", response_model=ExerciseRead)
def update_exercise(
    exercise_id: int,
    ex: ExerciseUpdate,
    session: Session = Depends(get_session)
    ):
    
    exercise = session.get(Exercise, exercise_id)
    if exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    updates = ex.model_dump(exclude_unset=True)

    for key, value in updates.items():
        setattr(exercise, key, value)

    session.commit()
    session.refresh(exercise)
    return exercise


@app.delete("/exercises/{exercise_id}", status_code=204)
def delete_exercise(
    exercise_id: int,
    session: Session = Depends(get_session)
    ):

    exercise = session.get(Exercise, exercise_id)
    if exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    session.delete(exercise)
    session.commit()




    
