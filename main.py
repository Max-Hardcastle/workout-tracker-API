from fastapi import FastAPI
from models import ExerciseBase, Exercise, ExerciseUpdate

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Server running"}

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