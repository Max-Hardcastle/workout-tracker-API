<<<<<<< HEAD
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
=======
from fastapi import FastAPI
from models import ExerciseBase, Exercise, ExerciseUpdate

app = FastAPI()
>>>>>>> 403a35f1a197f8e30e876d7783481c8e04cdb808

@app.get("/")
def root():
    return {"message": "Server running"}

<<<<<<< HEAD
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




    
=======
exercises = [
    Exercise(id=1, name="Bench Press", description="Flat chest pressing exercise"),
    Exercise(id=2, name="Squat", description="Leg pressing exercise")
]

@app.get("/exercises")
def get_all_exercises():
    return exercises

@app.get("/exercises/{exercise_id}")
def get_exercise(exercise_id: int):
    for exercise in exercises:
        if exercise.id == exercise_id:
            return exercise
    return "Exercise not found"

@app.post("/exercises", response_model=Exercise)
def create_exercise(payload: ExerciseBase):
    new_id = max((e.id for e in exercises), default=0) + 1
    new_ex = Exercise(
    id=new_id,
    **payload.model_dump()
    )
    exercises.append(new_ex)
    return new_ex

@app.patch("/exercises/{exercise_id}", response_model=Exercise)
def update_exercise(exercise_id: int, payload: ExerciseUpdate):
    for i, ex in enumerate(exercises):
        if ex.id == exercise_id:
            updated = ex.model_copy(update=payload.model_dump(exclude_unset=True))
            exercises[i] = updated
            return updated
    
    return "Exercise not found"

@app.delete("/exercises/{exercise_id}")
def delete_exercise(exercise_id: int):
        for i, ex in enumerate(exercises):
            if ex.id == exercise_id:
                exercises.pop(i)
                return
            
        return "Exercise not found"
>>>>>>> 403a35f1a197f8e30e876d7783481c8e04cdb808
