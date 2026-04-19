## Overview
This is an API to allow users to manage exercises in the context of a workout tracker.
Future development will look to extend functionality so users can add exercises and corresponding reps and sets to a 'workout'.

## The API allows users to:
- Create exercises
- Retrieve all exercises
- Retrieve a single exercise
- Delete exercises
- Edit exercises

## Tech Stack
- Python 3.10+
- FastAPI
- SQLModel
- SQLite
- pytest

## Setup Instructions
- git clone <https://github.com/Max-Hardcastle/workout-tracker-API>
- cd workout-tracker-API
- python -m venv venv
- venv\Scripts\activate   # Windows
- pip install -r requirements.txt

## Running Instructions
- uvicorn main:app --reload
- visit the following address and interact via Swagger UI http://127.0.0.1:8000/docs

## Example endpoints:

### Create an exercise
POST /exercises
{
  "name": "Bench Press",
  "description": "Chest pressing movement"
}

### Get all exercises
GET /exercises

### Get one exercise
GET /exercises/{exercise_id}

### Delete an exercise
DELETE /exercises/{exercise_id}

### Amend an exercise
PATCH /exercises/{exercise_id}

## Testing
Pytest is used for automated testing. Tests cover:
- Getting the root
- Getting all exercises when the database is empty
- Getting all exercises when the database contains data
- Creating an exercise
- Getting a specific exercise
- Deleting an exercise
- Editing an exercise

### Run Tests Instructions
- python -m pytest -v