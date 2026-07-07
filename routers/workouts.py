from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, delete
from schemas import WorkoutCreate, WorkoutRead, WorkoutUpdate, ExerciseSetRead, ExerciseSetCreate, ExerciseRead, ExerciseSetUpdate
from database import get_session
from models import Workout, Exercise, ExerciseSet
import models

router = APIRouter(prefix="/workouts", tags=["Workouts"])

#Get all workouts
@router.get("/", response_model=list[WorkoutRead])
def get_workouts(session: Session = Depends(get_session)):
    return session.exec(select(Workout)).all()

#Get specific workout via ID
@router.get("/{workout_id}", response_model=WorkoutRead)
def get_workout(workout_id: int, session: Session = Depends(get_session)):
    workout = session.get(Workout, workout_id)

    if workout is None:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    return workout

#Create new workout
@router.post("/", response_model=WorkoutRead, status_code=201)
def create_workout(wrk: WorkoutCreate, session: Session = Depends(get_session)):
    db_wrk = Workout(**wrk.model_dump())
    session.add(db_wrk)
    session.commit()
    session.refresh(db_wrk)
    return db_wrk


#Edit workout
@router.patch("/{workout_id}", response_model=WorkoutRead)
def update_workout(
    workout_id: int,
    wrk: WorkoutUpdate,
    session: Session = Depends(get_session)
    ):
    
    workout = session.get(Workout, workout_id)
    if workout is None:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    updates = wrk.model_dump(exclude_unset=True)

    for key, value in updates.items():
        setattr(workout, key, value)

    session.commit()
    session.refresh(workout)
    return workout

#Delete workout
@router.delete("/{workout_id}", status_code=204)
def delete_workout(
    workout_id: int,
    session: Session = Depends(get_session)
    ):

    workout = session.get(Workout, workout_id)
    if workout is None:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    #Delete sets within the workout
    session.exec(
        delete(ExerciseSet).where(
            ExerciseSet.workout_id == workout_id
        )
    )

    #Delete workout
    session.delete(workout)
    session.commit()

#Add exercise set to a workout
@router.post("/{workout_id}/sets", response_model=ExerciseSetRead, status_code=201)
def add_exercise_to_workout(
    workout_id: int,
    set_data: ExerciseSetCreate,
    session: Session = Depends(get_session)
    ):
    
    #Check that workout exists
    workout = session.get(Workout, workout_id)
    if workout is None:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    #Check that exercise exists
    exercise = session.get(Exercise, set_data.exercise_id)
    if exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    #Create set row
    exercise_set = ExerciseSet(
    workout_id = workout_id,
    exercise_id = set_data.exercise_id,
    set_number = set_data.set_number,
    reps = set_data.reps,
    weight = set_data.weight
    )
    
    session.add(exercise_set)
    session.commit()
    session.refresh(exercise_set)
    return exercise_set


#Delete exercise set from a workout
@router.delete("/{workout_id}/sets/{exercise_set_id}", status_code=204)
def delete_set_from_workout(
    workout_id: int,
    exercise_set_id: int,
    session: Session = Depends(get_session)
    ):

    exercise_set = session.get(ExerciseSet, exercise_set_id)

    #Check that set exists
    if exercise_set is None:
        raise HTTPException(status_code=404, detail="Set not found")

    #Check that set is in this workout
    if exercise_set.workout_id != workout_id:
        raise HTTPException(status_code=404, detail="Set not found in this workout")
    
    session.delete(exercise_set)
    session.commit()

#Get an exercise set from a workout
@router.get("/{workout_id}/sets/{exercise_set_id}", response_model=ExerciseSetRead)
def get_exercise_set(
    workout_id: int,
    exercise_set_id: int,
    session: Session = Depends(get_session)):

    exercise_set = session.get(ExerciseSet, exercise_set_id)

    #Check that set exists
    if exercise_set is None:
        raise HTTPException(status_code=404, detail="Set not found")

    #Check that set is in this workout
    if exercise_set.workout_id != workout_id:
        raise HTTPException(status_code=404, detail="Set not found in this workout")

    return exercise_set

#Get all sets of an exercise in a workout
@router.get("/{workout_id}/exercises/{exercise_id}/sets", response_model = list[ExerciseSetRead])
def get_multiple_exercise_sets(
    workout_id: int,
    exercise_id: int,
    session: Session = Depends(get_session)):

    sets = session.exec(
        select(ExerciseSet).where(
            ExerciseSet.workout_id == workout_id,
            ExerciseSet.exercise_id == exercise_id
            )
            ).all()
    
    if not sets:
        raise HTTPException(status_code=404, detail="No sets found for this exercise in this workout")

    return sets

#Get a list of all exercise sets in a workout
@router.get("/{workout_id}/sets", response_model = list[ExerciseSetRead])
def get_workout_exercise_sets(
    workout_id: int,
    session: Session = Depends(get_session)):
    
    exercise_sets = session.exec(
        select(ExerciseSet).where(
            ExerciseSet.workout_id == workout_id,
            )
            ).all()

    if not exercise_sets:
        raise HTTPException(status_code=404, detail="No exercises found in this workout")
    
    return exercise_sets
    
#Amend exercise in workout
@router.patch("/{workout_id}/sets/{exercise_set_id}", response_model=ExerciseSetRead)
def edit_workout_set(
    edited_set: ExerciseSetUpdate,
    exercise_set_id: int,
    workout_id: int,
    session: Session = Depends(get_session)):

    exercise_set = session.get(ExerciseSet, exercise_set_id)

    #Check that set exists
    if exercise_set is None:
        raise HTTPException(status_code=404, detail="Set not found")

    #Check that set is in this workout
    if exercise_set.workout_id != workout_id:
        raise HTTPException(status_code=404, detail="Set not found in this workout")
    
    updates = edited_set.model_dump(exclude_unset=True)

    for key, value in updates.items():
        setattr(exercise_set, key, value)

    session.commit()
    session.refresh(exercise_set)
    return exercise_set

    
    


    
