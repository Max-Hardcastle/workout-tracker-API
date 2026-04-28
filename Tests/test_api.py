import pytest
import os
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine
from models import Exercise
from main import app
from database import get_session

test_db = "./test.db"

engine = create_engine(
    f"sqlite:///{test_db}",
    connect_args={"check_same_thread": False}
)

def get_test_session():
    with Session(engine) as session:
        yield session

app.dependency_overrides[get_session] = get_test_session

#A temporary client which creates new database and table for each test.
#Temp table is removed after each test.
@pytest.fixture(name="client")
def client_fixture():
    SQLModel.metadata.create_all(engine)

    with TestClient(app) as client:
        yield client

    SQLModel.metadata.drop_all(engine)
    engine.dispose()

    if os.path.exists(test_db):
        os.remove(test_db)


#Test root get
def test_root(client):
    response = client.get("/")
    assert response.status_code == 200

#Test get all exercises while database is empty
def test_get_exercises_empty(client):
    response = client.get("/exercises")
    assert response.status_code == 200
    assert response.json() == []

#Test get all exercises while database contains data
def test_get_exercises_not_empty(client):
    #create example data
    added = client.post(
        "/exercises",
        json={
            "name": "Bench Press",
            "description": "DB/BB Chest Pressing Exercise"
        }
    )
    assert added.status_code == 201

    response = client.get("/exercises")
    assert response.status_code == 200

    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Bench Press"
    assert data[0]["description"] == "DB/BB Chest Pressing Exercise"

#Test post to create exercise
def test_create_ex(client):
    response = client.post(
        "/exercises",
        json={
            "name": "Bench Press",
            "description": "DB/BB Chest Pressing Exercise"
        }
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Bench Press"
    assert data["description"] == "DB/BB Chest Pressing Exercise"

#Test get for specific exercise
def test_get_one_exercise(client):
     #create example data
    added = client.post(
        "/exercises",
        json={
            "name": "Bench Press",
            "description": "DB/BB Chest Pressing Exercise"
        }
    )
    assert added.status_code == 201

    created = added.json()
    added_id = created["id"]

    #get data
    response = client.get(f"/exercises/{added_id}")
    assert response.status_code == 200
    
    details = response.json()
    assert details["name"] == "Bench Press"

#Test deleting an exercise
def test_delete_exercise(client):

    #create data to be deleted
    added = client.post(
        "/exercises",
        json={
            "name": "Bench Press",
            "description": "DB/BB Chest Pressing Exercise"
        }
    )
    assert added.status_code == 201

    created = added.json()
    added_id = created["id"]

    #delete data
    delete_response = client.delete(f"/exercises/{added_id}")
    assert delete_response.status_code == 204
    
    #Check data is deleted
    get_response = client.get(f"/exercises/{added_id}")
    assert get_response.status_code == 404

#Test editing an exercise
def test_amend(client):
        #create data to be amended
    added = client.post(
        "/exercises",
        json={
            "name": "Bench Press",
            "description": "DB/BB Chest Pressing Exercise"
        }
    )
    assert added.status_code == 201

    created = added.json()
    added_id = created["id"]

    assert created["description"] == "DB/BB Chest Pressing Exercise"

    amended = client.patch(
        f"/exercises/{added_id}",
        json={
            "description": "Chest Press Movement"
        }
    )
    assert amended.status_code == 200
    
    amended_details = amended.json()
    assert amended_details["description"] == "Chest Press Movement"


#Test get all workouts while database is empty
def test_get_workouts_empty(client):
    response = client.get("/workouts")
    assert response.status_code == 200
    assert response.json() == []

#Test get all workouts while database contains data
def test_get_workouts_not_empty(client):
    #create example data
    added = client.post(
        "/workouts",
        json={
            "workout_date": "2026-04-27"
            }
    )
    assert added.status_code == 201

    response = client.get("/workouts")
    assert response.status_code == 200

    data = response.json()
    assert len(data) == 1
    assert data[0]["workout_date"] == "2026-04-27"

#Test getting specific workout
def test_get_one_workout(client):
    #create data to be deleted
    added = client.post(
        "/workouts",
        json={
            "workout_date": "2026-03-01"
        }
    )
    assert added.status_code == 201

    created = added.json()
    added_id = created["id"]

    #get data
    response = client.get(f"/workouts/{added_id}")
    assert response.status_code == 200

    data = response.json()
    assert data["workout_date"] == "2026-03-01"

#Test create new workout
def test_create_workout(client):
    response = client.post(
        "/workouts",
        json={
            "workout_date": "2026-04-20"
        }
    )

    assert response.status_code == 201
    data = response.json()
    assert data["workout_date"] == "2026-04-20"


#Test amending workout
def test_amend_workout(client):
    #create data to be amended
    added = client.post(
        "/workouts",
        json={
            "workout_date": "2026-04-01"
        }
    )
    assert added.status_code == 201

    created = added.json()
    added_id = created["id"]

    assert created["workout_date"] == "2026-04-01"

    amended = client.patch(
        f"/workouts/{added_id}",
        json={
            "workout_date": "2026-04-05"
        }
    )
    assert amended.status_code == 200
    
    amended_details = amended.json()
    assert amended_details["workout_date"] == "2026-04-05"

#Test deleting a workout
def test_delete_workout(client):
    #create data to be deleted
    added = client.post(
        "/workouts",
        json={
            "workout_date": "2026-04-01"
        }
    )
    assert added.status_code == 201

    created = added.json()
    added_id = created["id"]

    #delete data
    delete_response = client.delete(f"/workouts/{added_id}")
    assert delete_response.status_code == 204
    
    #Check data is deleted
    get_response = client.get(f"/workouts/{added_id}")
    assert get_response.status_code == 404

#Test adding set to a workout
def test_add_set_to_workout(client):

    #create test exercise
    added_ex = client.post(
        "/exercises",
        json={
            "name": "Bench Press",
            "description": "DB/BB Chest Pressing Exercise"
        }
    )
    assert added_ex.status_code == 201

    created_ex = added_ex.json()
    added_ex_id = created_ex["id"]

    #create test workout
    added_wrk = client.post(
        "/workouts",
        json={
            "workout_date": "2026-01-01"
        }
    )
    assert added_wrk.status_code == 201

    created_wrk = added_wrk.json()
    added_wrk_id = created_wrk["id"]

    response = client.post(
        f"/workouts/{added_wrk_id}/sets",
        json={
              "exercise_id": (added_ex_id),
              "set_number": 1,
              "reps": 10,
              "weight": 50
        }
    )
    assert response.status_code == 201


#Test deleting exercise from workout
def delete_set_from_workout(client):
#create test exercise
    added_ex = client.post(
        "/exercises",
        json={
            "name": "Bench Press",
            "description": "DB/BB Chest Pressing Exercise"
        }
    )
    assert added_ex.status_code == 201

    created_ex = added_ex.json()
    added_ex_id = created_ex["id"]

    #create test workout
    added_wrk = client.post(
        "/workouts",
        json={
            "workout_date": "2026-01-01"
        }
    )
    assert added_wrk.status_code == 201

    created_wrk = added_wrk.json()
    added_wrk_id = created_wrk["id"]

    combine = client.post(
        f"/workouts/{added_wrk_id}/sets",
        json={
              "exercise_id": (added_ex_id),
              "set_number": 1,
              "reps": 10,
              "weight": 50
        }
    )
    assert combine.status_code == 201

    #delete data
    delete_response = client.delete(f"/workouts/{added_wrk_id}/sets/{added_ex_id}")
    assert delete_response.status_code == 204
    
    #Check data is deleted
    get_response = client.get(f"/workouts/{added_wrk_id}/sets/{added_ex_id}")
    assert get_response.status_code == 404

#Get all sets of a particular exercise from a workout
def test_get_all_exercise_sets(client):
#create test exercise
    added_ex = client.post(
        "/exercises",
        json={
            "name": "Bench Press",
            "description": "DB/BB Chest Pressing Exercise"
        }
    )
    assert added_ex.status_code == 201

    created_ex = added_ex.json()
    added_ex_id = created_ex["id"]

    #create test workout
    added_wrk = client.post(
        "/workouts",
        json={
            "workout_date": "2026-01-01"
        }
    )
    assert added_wrk.status_code == 201

    created_wrk = added_wrk.json()
    added_wrk_id = created_wrk["id"]

    #Add set 1
    combine = client.post(
        f"/workouts/{added_wrk_id}/sets",
        json={
              "exercise_id": (added_ex_id),
              "set_number": 1,
              "reps": 10,
              "weight": 50
        }
    )
    assert combine.status_code == 201

    #Add set 2
    combine = client.post(
        f"/workouts/{added_wrk_id}/sets",
        json={
              "exercise_id": (added_ex_id),
              "set_number": 2,
              "reps": 10,
              "weight": 50
        }
    )
    assert combine.status_code == 201

    response = client.get(
        f"/workouts/{added_wrk_id}/exercises/{added_ex_id}/sets"
    )

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 2
    assert data[0]["set_number"] == 1
    assert data[1]["set_number"] == 2

#Test getting all sets of a particular exercise from a workout
def test_get_one_exercise_sets(client):
#create test exercise
    added_ex = client.post(
        "/exercises",
        json={
            "name": "Bench Press",
            "description": "DB/BB Chest Pressing Exercise"
        }
    )
    assert added_ex.status_code == 201

    created_ex = added_ex.json()
    added_ex_id = created_ex["id"]

    #create test workout
    added_wrk = client.post(
        "/workouts",
        json={
            "workout_date": "2026-01-01"
        }
    )
    assert added_wrk.status_code == 201

    created_wrk = added_wrk.json()
    added_wrk_id = created_wrk["id"]

    #Add set
    combine = client.post(
        f"/workouts/{added_wrk_id}/sets",
        json={
              "exercise_id": (added_ex_id),
              "set_number": 1,
              "reps": 10,
              "weight": 50
        }
    )
    assert combine.status_code == 201

    response = client.get(
        f"/workouts/{added_wrk_id}/sets/{added_ex_id}"
    )

    assert response.status_code == 200
    data = response.json()

    assert data["set_number"] == 1


#Test getting all exercises in a workout
def test_get_all_workout_exercises(client):
#Create test exercise 1
    added_ex = client.post(
        "/exercises",
        json={
            "name": "Bench Press",
            "description": "DB/BB Chest Pressing Exercise"
        }
    )
    assert added_ex.status_code == 201

    created_ex = added_ex.json()
    added_ex_id_1 = created_ex["id"]

    #Create test exercise 2
    added_ex = client.post(
        "/exercises",
        json={
            "name": "Squat",
            "description": "Leg Pressing Exercise"
        }
    )
    assert added_ex.status_code == 201

    created_ex = added_ex.json()
    added_ex_id_2 = created_ex["id"]

    #create test workout
    added_wrk = client.post(
        "/workouts",
        json={
            "workout_date": "2026-01-01"
        }
    )
    assert added_wrk.status_code == 201

    created_wrk = added_wrk.json()
    added_wrk_id = created_wrk["id"]

    #Add exercise 1
    combine = client.post(
        f"/workouts/{added_wrk_id}/sets",
        json={
              "exercise_id": (added_ex_id_1),
              "set_number": 1,
              "reps": 10,
              "weight": 50
        }
    )
    assert combine.status_code == 201

    #Add set 2
    combine = client.post(
        f"/workouts/{added_wrk_id}/sets",
        json={
              "exercise_id": (added_ex_id_2),
              "set_number": 1,
              "reps": 10,
              "weight": 100
        }
    )
    assert combine.status_code == 201

    response = client.get(
        f"/workouts/{added_wrk_id}/sets"
    )

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 2
    assert data[0]["name"] == "Bench Press"
    assert data[1]["name"] == "Squat"

#Test editing a set within a workout
def test_edit_workout_set(client):
    #create test exercise
    added_ex = client.post(
        "/exercises",
        json={
            "name": "Bench Press",
            "description": "DB/BB Chest Pressing Exercise"
        }
    )
    assert added_ex.status_code == 201

    created_ex = added_ex.json()
    added_ex_id = created_ex["id"]

    #create test workout
    added_wrk = client.post(
        "/workouts",
        json={
            "workout_date": "2026-01-01"
        }
    )
    assert added_wrk.status_code == 201

    created_wrk = added_wrk.json()
    added_wrk_id = created_wrk["id"]

    #Add set
    combine = client.post(
        f"/workouts/{added_wrk_id}/sets",
        json={
              "exercise_id": (added_ex_id),
              "set_number": 1,
              "reps": 10,
              "weight": 50
        }
    )
    assert combine.status_code == 201

    combined = combine.json()
    exercise_set_id = combined["id"]

    #Amend the set
    amended = client.patch(
        f"/workouts/{added_wrk_id}/sets/{exercise_set_id}",
        json={
              "reps": 200,
              "weight": 1
        }
    )

    amended_details = amended.json()

    print(amended_details)

    assert amended_details["reps"] == 200
    assert amended_details["weight"] == 1