from fastapi import FastAPI

from app.database.connection import supabase
from app.auth import router as auth_router

from app.routes.courses import router as courses_router
from app.routes.enrollments import router as enrollments_router
from app.routes.workouts import router as workouts_router
from app.routes.progress import router as progress_router
from app.routes.goals import router as goals_router


app = FastAPI(
    title="FitFlow API",
    description="Backend API for FitFlow",
    version="1.0.0",
)


# --------------------------------------------------
# ROOT
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "FitFlow API is running",
        "version": "1.0.0"
    }


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# --------------------------------------------------
# TEST SUPABASE
# --------------------------------------------------

@app.get("/test-supabase")
def test_supabase():

    response = (
        supabase
        .table("courses")
        .select("*")
        .limit(5)
        .execute()
    )

    return {
        "connected": True,
        "courses": response.data
    }


# --------------------------------------------------
# AUTHENTICATION API
# --------------------------------------------------

app.include_router(
    auth_router
)


# --------------------------------------------------
# COURSES API
# --------------------------------------------------

app.include_router(
    courses_router,
    prefix="/api/courses",
    tags=["Courses"]
)


# --------------------------------------------------
# ENROLLMENTS API
# --------------------------------------------------

app.include_router(
    enrollments_router,
    prefix="/api",
    tags=["Enrollments"]
)


# --------------------------------------------------
# WORKOUTS API
# --------------------------------------------------

app.include_router(
    workouts_router,
    prefix="/api/workouts",
    tags=["Workouts"]
)


# --------------------------------------------------
# PROGRESS API
# --------------------------------------------------

app.include_router(
    progress_router,
    prefix="/api/progress",
    tags=["Progress"]
)


# --------------------------------------------------
# GOALS API
# --------------------------------------------------

app.include_router(
    goals_router,
    prefix="/api/goals",
    tags=["Goals"]
)