# Workout Tracker

## Overview

This is a full-stack workout tracker built using FastAPI and React.

The project began as an API for managing exercises and has since been expanded to allow users to:

- Manage exercises
- Create workouts
- Add exercise sets to workouts
- Record reps and weight
- Edit and delete existing data

The project was created to develop my understanding of API development, relational databases, frontend development, validation and automated testing.

## Features

The application allows users to:

- Create, view, edit and delete exercises
- Create, view, edit and delete workouts
- Add exercise sets to a workout
- Record the exercise, number of reps and weight for each set
- Edit and delete sets
- View all sets associated with a workout
- Validate submitted data
- Display backend validation errors in the frontend

Deleting an exercise or workout also deletes any associated exercise sets.

## Tech Stack

### Backend

- Python
- FastAPI
- SQLModel
- SQLite
- Pydantic
- pytest

### Frontend

- React
- TypeScript
- Vite
- Vitest
- React Testing Library

## Setup Instructions

Clone the repository:

git clone https://github.com/Max-Hardcastle/workout-tracker-API
cd workout-tracker-API

Create and activate a Python virtual environment:

python -m venv myenv

Windows:

myenv\Scripts\activate

Install the backend dependencies:

pip install -r requirements.txt

Install the frontend dependencies:

cd frontend
npm install

## Running the Application

The backend and frontend run in separate terminals.

### Backend

From the project root:

uvicorn main:app --reload

The API will be available at: http://127.0.0.1:8000

Swagger documentation: http://127.0.0.1:8000/docs

### Frontend

From the `frontend` folder:

npm run dev

The frontend will usually be available at: http://localhost:5173

## Validation

Pydantic schemas are used to validate incoming API requests. Validation errors returned by the API are displayed in the React frontend.

## Testing

### Backend

Automated API tests are written using pytest.

Run the backend tests:

python -m pytest -v

### Frontend

Component tests are written using Vitest and React Testing Library.

Run the frontend tests:

cd frontend
npm test

## Future Development

Planned improvements include:

- Move from SQLite to PostgreSQL
- Increase frontend test coverage
- Deploy the application to a cloud platform
- Improve accessibility and error handling
