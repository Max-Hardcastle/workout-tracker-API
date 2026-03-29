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
def test_get_all_empty(client):
    response = client.get("/exercises")
    assert response.status_code == 200
    assert response.json() == []

#Test get all exercises while database contains data
def test_get_all_not_empty(client):
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
def test_get_one(client):
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
def test_delete(client):

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



