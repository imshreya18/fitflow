from fastapi import APIRouter, HTTPException, Depends
from app.database.connection import supabase
from app.auth import get_current_user
from datetime import date, timedelta


router = APIRouter(tags=["Progress"])


# --------------------------------------------------
# GET USER PROGRESS
# --------------------------------------------------

@router.get("/")
def get_progress(
    user=Depends(get_current_user)
):

    try:
        # ------------------------------------------
        # Get authenticated user's ID
        # ------------------------------------------

        user_id = str(user.id)

        # ------------------------------------------
        # Get completed workout sessions
        # ------------------------------------------

        response = (
            supabase
            .table("workout_sessions")
            .select("*")
            .eq("user_id", user_id)
            .eq("completed", True)
            .execute()
        )

        sessions = response.data or []

        # ------------------------------------------
        # Total workouts
        # ------------------------------------------

        total_workouts = len(sessions)

        # ------------------------------------------
        # Total active minutes
        # ------------------------------------------

        total_active_minutes = sum(
            session.get("duration_minutes") or 0
            for session in sessions
        )

        # ------------------------------------------
        # Current week
        # ------------------------------------------

        today = date.today()
        week_start = today - timedelta(days=today.weekday())

        weekly_sessions = []

        for session in sessions:

            completed_at = session.get("completed_at")

            if completed_at:
                completed_date = completed_at[:10]

                if completed_date >= week_start.isoformat():
                    weekly_sessions.append(session)

        weekly_workouts = len(weekly_sessions)

        weekly_active_minutes = sum(
            session.get("duration_minutes") or 0
            for session in weekly_sessions
        )

        return {
            "success": True,
            "progress": {
                "total_workouts": total_workouts,
                "total_active_minutes": total_active_minutes,
                "weekly_workouts": weekly_workouts,
                "weekly_active_minutes": weekly_active_minutes
            }
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch progress: {str(e)}"
        )


# --------------------------------------------------
# GET STREAK
# --------------------------------------------------

@router.get("/streaks")
def get_streak(
    user=Depends(get_current_user)
):

    try:

        user_id = str(user.id)

        response = (
            supabase
            .table("streaks")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        if not response.data:
            return {
                "success": True,
                "streak": {
                    "current_streak": 0,
                    "longest_streak": 0,
                    "last_workout_date": None
                }
            }

        streak = response.data[0]

        return {
            "success": True,
            "streak": streak
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch streak: {str(e)}"
        )


# --------------------------------------------------
# GET USER GOALS
# --------------------------------------------------

@router.get("/goals")
def get_goals(
    user=Depends(get_current_user)
):

    try:

        user_id = str(user.id)

        response = (
            supabase
            .table("goals")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )

        return {
            "success": True,
            "goals": response.data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch goals: {str(e)}"
        )