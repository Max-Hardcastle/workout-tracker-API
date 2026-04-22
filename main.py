from fastapi import FastAPI
from contextlib import asynccontextmanager
from database import create_db_and_tables
from routers import exercises, workouts

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)
app.include_router(exercises.router)
app.include_router(workouts.router)

#Root endpoint
@app.get("/")
def root():
    return {"message": "Server running"}