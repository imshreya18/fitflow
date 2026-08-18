from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.database.connection import supabase
from app.auth import get_current_user

from datetime import datetime, timezone, date, timedelta


router = APIRouter(tags=["Workouts"])


# ============================================================
# SCHEMAS
# ============================================================

class CompleteWorkoutRequest(BaseModel):
    duration_minutes: int


# ============================================================
# GET ALL WORKOUTS
# ============================================================

@router.get("/")
def get_workouts(
    user=Depends(get_current_user)
):

    try:

        response = (
            supabase
            .table("workouts")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )

        return {
            "success": True,
            "workouts": response.data or []
        }

    except Exception as e:

        print("Get workouts error:", repr(e))

        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch workouts: {str(e)}"
        )


# ============================================================
# GET SINGLE WORKOUT
# ============================================================

@router.get("/{workout_id}")
def get_workout(
    workout_id: int,
    user=Depends(get_current_user)
):

    try:

        response = (
            supabase
            .table("workouts")
            .select("*")
            .eq("id", workout_id)
            .execute()
        )

        if not response.data:

            raise HTTPException(
                status_code=404,
                detail="Workout not found"
            )

        return {
            "success": True,
            "workout": response.data[0]
        }

    except HTTPException:
        raise

    except Exception as e:

        print("Get workout error:", repr(e))

        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch workout: {str(e)}"
        )


# ============================================================
# GET WORKOUT EXERCISES
# ============================================================

@router.get("/{workout_id}/exercises")
def get_workout_exercises(
    workout_id: int,
    user=Depends(get_current_user)
):

    try:

        # ----------------------------------------------------
        # Check workout exists
        # ----------------------------------------------------

        workout_response = (
            supabase
            .table("workouts")
            .select("id")
            .eq("id", workout_id)
            .execute()
        )

        if not workout_response.data:

            raise HTTPException(
                status_code=404,
                detail="Workout not found"
            )

        # ----------------------------------------------------
        # Get exercises
        # ----------------------------------------------------

        response = (
            supabase
            .table("exercises")
            .select("*")
            .eq("workout_id", workout_id)
            .order("exercise_order")
            .execute()
        )

        return {
            "success": True,
            "workout_id": workout_id,
            "exercises": response.data or []
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "Get workout exercises error:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch exercises: {str(e)}"
        )


# ============================================================
# START WORKOUT
# ============================================================

@router.post("/{workout_id}/start")
def start_workout(
    workout_id: int,
    user=Depends(get_current_user)
):

    try:

        user_id = str(user.id)

        # ----------------------------------------------------
        # Check workout exists
        # ----------------------------------------------------

        workout_response = (
            supabase
            .table("workouts")
            .select("id")
            .eq("id", workout_id)
            .execute()
        )

        if not workout_response.data:

            raise HTTPException(
                status_code=404,
                detail="Workout not found"
            )

        # ----------------------------------------------------
        # Check if user already has an active session
        # ----------------------------------------------------

        existing_response = (
            supabase
            .table("workout_sessions")
            .select("*")
            .eq("user_id", user_id)
            .eq("workout_id", workout_id)
            .eq("completed", False)
            .order("started_at", desc=True)
            .limit(1)
            .execute()
        )

        if existing_response.data:

            return {
                "success": True,
                "message": "Workout already started",
                "session": existing_response.data[0]
            }

        # ----------------------------------------------------
        # Create NEW active session
        #
        # IMPORTANT:
        # completed = False
        #
        # Therefore this does NOT count as a workout yet.
        # ----------------------------------------------------

        started_at = datetime.now(timezone.utc)

        response = (
            supabase
            .table("workout_sessions")
            .insert({
                "user_id": user_id,
                "workout_id": workout_id,
                "started_at": started_at.isoformat(),
                "completed": False
            })
            .execute()
        )

        if not response.data:

            raise HTTPException(
                status_code=500,
                detail="Unable to create workout session"
            )

        return {
            "success": True,
            "message": "Workout started",
            "session": response.data[0]
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "Start workout error:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=f"Failed to start workout: {str(e)}"
        )


# ============================================================
# COMPLETE WORKOUT
# ============================================================

@router.post("/{workout_id}/complete")
def complete_workout(
    workout_id: int,
    data: CompleteWorkoutRequest,
    user=Depends(get_current_user)
):

    try:

        user_id = str(user.id)

        # ----------------------------------------------------
        # Validate duration
        # ----------------------------------------------------

        if data.duration_minutes <= 0:

            raise HTTPException(
                status_code=400,
                detail="Workout duration must be greater than 0"
            )

        # ----------------------------------------------------
        # Check workout exists
        # ----------------------------------------------------

        workout_response = (
            supabase
            .table("workouts")
            .select("id")
            .eq("id", workout_id)
            .execute()
        )

        if not workout_response.data:

            raise HTTPException(
                status_code=404,
                detail="Workout not found"
            )

        # ----------------------------------------------------
        # Find latest ACTIVE session
        #
        # Only completed=False sessions can be completed.
        # ----------------------------------------------------

        session_response = (
            supabase
            .table("workout_sessions")
            .select("*")
            .eq("user_id", user_id)
            .eq("workout_id", workout_id)
            .eq("completed", False)
            .order("started_at", desc=True)
            .limit(1)
            .execute()
        )

        if not session_response.data:

            raise HTTPException(
                status_code=404,
                detail=(
                    "No active workout session found. "
                    "Please start the workout first."
                )
            )

        session = session_response.data[0]

        # ----------------------------------------------------
        # Complete session
        # ----------------------------------------------------

        completed_at = datetime.now(timezone.utc)

        update_response = (
            supabase
            .table("workout_sessions")
            .update({
                "completed": True,
                "completed_at": completed_at.isoformat(),
                "duration_minutes": data.duration_minutes
            })
            .eq("id", session["id"])
            .eq("user_id", user_id)
            .eq("completed", False)
            .execute()
        )

        if not update_response.data:

            raise HTTPException(
                status_code=500,
                detail="Unable to complete workout"
            )

        completed_session = update_response.data[0]

        # ====================================================
        # UPDATE STREAK
        # ====================================================

        workout_date = completed_at.date()

        streak_response = (
            supabase
            .table("streaks")
            .select("*")
            .eq("user_id", user_id)
            .limit(1)
            .execute()
        )

        # ----------------------------------------------------
        # No streak record yet
        # ----------------------------------------------------

        if not streak_response.data:

            streak_insert = (
                supabase
                .table("streaks")
                .insert({
                    "user_id": user_id,
                    "current_streak": 1,
                    "longest_streak": 1,
                    "last_workout_date": workout_date.isoformat(),
                    "updated_at": completed_at.isoformat()
                })
                .execute()
            )

            if not streak_insert.data:

                raise HTTPException(
                    status_code=500,
                    detail="Workout completed but streak could not be created"
                )

            streak = streak_insert.data[0]

        # ----------------------------------------------------
        # Existing streak
        # ----------------------------------------------------

        else:

            streak = streak_response.data[0]

            current_streak = (
                int(streak.get("current_streak") or 0)
            )

            longest_streak = (
                int(streak.get("longest_streak") or 0)
            )

            last_workout_date = (
                streak.get("last_workout_date")
            )

            # ------------------------------------------------
            # Convert database date
            # ------------------------------------------------

            if last_workout_date:

                if isinstance(
                    last_workout_date,
                    str
                ):

                    try:

                        last_workout_date = date.fromisoformat(
                            last_workout_date[:10]
                        )

                    except ValueError:

                        last_workout_date = None

            # ------------------------------------------------
            # Same day
            # ------------------------------------------------

            if last_workout_date == workout_date:

                new_current_streak = current_streak

            # ------------------------------------------------
            # Consecutive day
            # ------------------------------------------------

            elif (
                last_workout_date is not None
                and workout_date
                == last_workout_date + timedelta(days=1)
            ):

                new_current_streak = (
                    current_streak + 1
                )

            # ------------------------------------------------
            # Gap
            # ------------------------------------------------

            else:

                new_current_streak = 1

            # ------------------------------------------------
            # Longest streak
            # ------------------------------------------------

            new_longest_streak = max(
                longest_streak,
                new_current_streak
            )

            # ------------------------------------------------
            # Update streak
            # ------------------------------------------------

            streak_update = (
                supabase
                .table("streaks")
                .update({
                    "current_streak": new_current_streak,
                    "longest_streak": new_longest_streak,
                    "last_workout_date": workout_date.isoformat(),
                    "updated_at": completed_at.isoformat()
                })
                .eq("user_id", user_id)
                .execute()
            )

            if not streak_update.data:

                raise HTTPException(
                    status_code=500,
                    detail="Workout completed but streak could not be updated"
                )

            streak = streak_update.data[0]

        # ====================================================
        # RETURN
        # ====================================================

        return {
            "success": True,
            "message": "Workout completed successfully",

            "session": completed_session,

            "streak": {
                "current_streak": int(
                    streak.get("current_streak") or 0
                ),

                "longest_streak": int(
                    streak.get("longest_streak") or 0
                ),

                "last_workout_date":
                    streak.get("last_workout_date")
            }
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "Complete workout error:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=f"Failed to complete workout: {str(e)}"
        )


# ============================================================
# GET WORKOUT HISTORY
# ============================================================

@router.get("/history/all")
def get_workout_history(
    user=Depends(get_current_user)
):

    try:

        user_id = str(user.id)

        response = (
            supabase
            .table("workout_sessions")
            .select(
                "*, workouts(title, category, difficulty, duration_minutes)"
            )
            .eq("user_id", user_id)
            .order("started_at", desc=True)
            .execute()
        )

        return {
            "success": True,
            "history": response.data or []
        }

    except Exception as e:

        print(
            "Workout history error:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch workout history: {str(e)}"
        )