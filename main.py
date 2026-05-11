from fastapi import FastAPI
from contextlib import asynccontextmanager
from database import create_db_and_tables
from routers import exercises, workouts
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)
app.include_router(exercises.router)
app.include_router(workouts.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


#Root endpoint
@app.get("/")
def root():
    return {"message": "Server running"}