from fastapi import APIRouter, HTTPException, Depends
from app.database.connection import supabase
from app.auth import get_current_user
from datetime import datetime, timezone, date, timedelta


router = APIRouter(tags=["Workouts"])


# --------------------------------------------------
# GET ALL WORKOUTS
# --------------------------------------------------

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
            "workouts": response.data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch workouts: {str(e)}"
        )


# --------------------------------------------------
# GET SINGLE WORKOUT
# --------------------------------------------------

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
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch workout: {str(e)}"
        )


# --------------------------------------------------
# GET WORKOUT EXERCISES
# --------------------------------------------------

@router.get("/{workout_id}/exercises")
def get_workout_exercises(
    workout_id: int,
    user=Depends(get_current_user)
):

    try:

        # Check workout exists
        workout = (
            supabase
            .table("workouts")
            .select("id")
            .eq("id", workout_id)
            .execute()
        )

        if not workout.data:
            raise HTTPException(
                status_code=404,
                detail="Workout not found"
            )

        # Get exercises
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
            "exercises": response.data
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch exercises: {str(e)}"
        )


# --------------------------------------------------
# START WORKOUT
# --------------------------------------------------

@router.post("/{workout_id}/start")
def start_workout(
    workout_id: int,
    user=Depends(get_current_user)
):

    try:

        user_id = str(user.id)

        # Check workout exists
        workout = (
            supabase
            .table("workouts")
            .select("id")
            .eq("id", workout_id)
            .execute()
        )

        if not workout.data:
            raise HTTPException(
                status_code=404,
                detail="Workout not found"
            )

        # Create workout session
        response = (
            supabase
            .table("workout_sessions")
            .insert({
                "user_id": user_id,
                "workout_id": workout_id,
                "started_at": datetime.now(timezone.utc).isoformat(),
                "completed": False
            })
            .execute()
        )

        return {
            "success": True,
            "message": "Workout started",
            "session": response.data[0]
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to start workout: {str(e)}"
        )


# --------------------------------------------------
# COMPLETE WORKOUT
# --------------------------------------------------

@router.post("/{workout_id}/complete")
def complete_workout(
    workout_id: int,
    duration_minutes: int,
    user=Depends(get_current_user)
):

    try:

        user_id = str(user.id)

        # ------------------------------------------
        # 1. Find active session
        # ------------------------------------------

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
                detail="No active workout session found"
            )

        session = session_response.data[0]

        # ------------------------------------------
        # 2. Complete workout session
        # ------------------------------------------

        completed_at = datetime.now(timezone.utc)

        response = (
            supabase
            .table("workout_sessions")
            .update({
                "completed_at": completed_at.isoformat(),
                "duration_minutes": duration_minutes,
                "completed": True
            })
            .eq("id", session["id"])
            .execute()
        )

        completed_session = response.data[0]

        # ------------------------------------------
        # 3. Get existing streak
        # ------------------------------------------

        streak_response = (
            supabase
            .table("streaks")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        workout_date = completed_at.date()

        # ------------------------------------------
        # 4. Create first streak record
        # ------------------------------------------

        if not streak_response.data:

            streak_data = {
                "user_id": user_id,
                "current_streak": 1,
                "longest_streak": 1,
                "last_workout_date": workout_date.isoformat(),
                "updated_at": completed_at.isoformat()
            }

            streak_insert = (
                supabase
                .table("streaks")
                .insert(streak_data)
                .execute()
            )

            streak = streak_insert.data[0]

        else:

            # --------------------------------------
            # Existing streak
            # --------------------------------------

            streak = streak_response.data[0]

            current_streak = streak.get("current_streak") or 0
            longest_streak = streak.get("longest_streak") or 0
            last_workout_date = streak.get("last_workout_date")

            # Convert database date to date object
            if last_workout_date:

                if isinstance(last_workout_date, str):
                    last_workout_date = date.fromisoformat(
                        last_workout_date[:10]
                    )

            else:
                last_workout_date = None

            # --------------------------------------
            # Same day
            # --------------------------------------

            if last_workout_date == workout_date:

                # Don't increase streak twice on same day
                new_current_streak = current_streak

            # --------------------------------------
            # Consecutive day
            # --------------------------------------

            elif (
                last_workout_date is not None
                and workout_date == last_workout_date + timedelta(days=1)
            ):

                new_current_streak = current_streak + 1

            # --------------------------------------
            # Gap in workouts
            # --------------------------------------

            else:

                new_current_streak = 1

            # --------------------------------------
            # Update longest streak
            # --------------------------------------

            new_longest_streak = max(
                longest_streak,
                new_current_streak
            )

            # --------------------------------------
            # Update streak table
            # --------------------------------------

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

            streak = streak_update.data[0]

        # ------------------------------------------
        # 5. Return result
        # ------------------------------------------

        return {
            "success": True,
            "message": "Workout completed successfully",
            "session": completed_session,
            "streak": {
                "current_streak": streak["current_streak"],
                "longest_streak": streak["longest_streak"],
                "last_workout_date": streak["last_workout_date"]
            }
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to complete workout: {str(e)}"
        )


# --------------------------------------------------
# GET WORKOUT HISTORY
# --------------------------------------------------

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
            "history": response.data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch workout history: {str(e)}"
        )