from fastapi import Depends, HTTPException, APIRouter
from schemas import ExerciseCreate, ExerciseRead, ExerciseUpdate
from sqlmodel import Session, select, delete
from database import get_session
from models import Exercise, ExerciseSet

router = APIRouter(prefix="/exercises", tags=["Exercises"])

#Get all exercises
@router.get("/", response_model=list[ExerciseRead])
def get_exercises(session: Session = Depends(get_session)):
    return session.exec(select(Exercise)).all()

#Get specific exercise via ID
@router.get("/{exercise_id}", response_model=ExerciseRead)
def get_exercise(exercise_id: int, session: Session = Depends(get_session)):
    exercise = session.get(Exercise, exercise_id)

    if exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    return exercise

#Create new exercise
@router.post("/", response_model=ExerciseRead, status_code=201)
def create_exercise(ex: ExerciseCreate, session: Session = Depends(get_session)):
    db_ex = Exercise(**ex.model_dump())
    session.add(db_ex)
    session.commit()
    session.refresh(db_ex)
    return db_ex

#Edit exercise
@router.patch("/{exercise_id}", response_model=ExerciseRead)
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

#Delete exercise
@router.delete("/{exercise_id}", status_code=204)
def delete_exercise(
    exercise_id: int,
    session: Session = Depends(get_session)
    ):

    exercise = session.get(Exercise, exercise_id)
    if exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    #Delete sets linked to this exercise
    session.exec(
        delete(ExerciseSet).where(
            ExerciseSet.exercise_id == exercise_id
        )
    )
    
    session.delete(exercise)
    session.commit()