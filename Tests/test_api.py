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

#Test get all exercises while db is empty
def test_get_all(client):
    response = client.get("/exercises")
    assert response.status_code == 200
    assert response.json() == []

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