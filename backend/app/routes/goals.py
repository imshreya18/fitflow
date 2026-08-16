from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import date

from app.database.connection import supabase
from app.auth import get_current_user


router = APIRouter(tags=["Goals"])


# --------------------------------------------------
# REQUEST SCHEMAS
# --------------------------------------------------

class GoalCreate(BaseModel):
    title: str
    goal_type: str
    target_value: float
    current_value: float = 0
    unit: str
    deadline: Optional[date] = None
    status: str = "active"


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    goal_type: Optional[str] = None
    target_value: Optional[float] = None
    current_value: Optional[float] = None
    unit: Optional[str] = None
    deadline: Optional[date] = None
    status: Optional[str] = None


# --------------------------------------------------
# GET ALL GOALS FOR CURRENT USER
# --------------------------------------------------

@router.get("/")
def get_goals(
    user=Depends(get_current_user)
):

    user_id = str(user.id)

    response = (
        supabase
        .table("goals")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )

    return {
    "success": True,
    "goals": response.data
    }


# --------------------------------------------------
# GET SINGLE GOAL
# --------------------------------------------------

@router.get("/{goal_id}")
def get_goal(
    goal_id: int,
    user=Depends(get_current_user)
):

    user_id = str(user.id)

    response = (
        supabase
        .table("goals")
        .select("*")
        .eq("id", goal_id)
        .eq("user_id", user_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Goal not found"
        )

    return response.data[0]


# --------------------------------------------------
# CREATE GOAL
# --------------------------------------------------

@router.post("/")
def create_goal(
    goal: GoalCreate,
    user=Depends(get_current_user)
):

    user_id = str(user.id)

    data = goal.model_dump(mode="json")

    # Automatically assign the authenticated user
    data["user_id"] = user_id

    response = (
        supabase
        .table("goals")
        .insert(data)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=500,
            detail="Failed to create goal"
        )

    return response.data[0]


# --------------------------------------------------
# UPDATE GOAL
# --------------------------------------------------

@router.put("/{goal_id}")
def update_goal(
    goal_id: int,
    goal: GoalUpdate,
    user=Depends(get_current_user)
):

    user_id = str(user.id)

    update_data = {
        key: value
        for key, value in goal.model_dump(mode="json").items()
        if value is not None
    }

    if not update_data:
        raise HTTPException(
            status_code=400,
            detail="No fields provided for update"
        )

    response = (
        supabase
        .table("goals")
        .update(update_data)
        .eq("id", goal_id)
        .eq("user_id", user_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Goal not found"
        )

    return response.data[0]


# --------------------------------------------------
# DELETE GOAL
# --------------------------------------------------

@router.delete("/{goal_id}")
def delete_goal(
    goal_id: int,
    user=Depends(get_current_user)
):

    user_id = str(user.id)

    response = (
        supabase
        .table("goals")
        .delete()
        .eq("id", goal_id)
        .eq("user_id", user_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Goal not found"
        )

    return {
        "message": "Goal deleted successfully"
    }