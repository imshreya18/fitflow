from fastapi import APIRouter, HTTPException
from app.database.connection import supabase


router = APIRouter()


# --------------------------------------------------
# GET ALL COURSES
# --------------------------------------------------

@router.get("/")
def get_courses():

    try:
        response = (
            supabase
            .table("courses")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )

        return {
            "success": True,
            "courses": response.data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch courses: {str(e)}"
        )


# --------------------------------------------------
# GET SINGLE COURSE
# --------------------------------------------------

@router.get("/{course_id}")
def get_course(course_id: int):

    try:
        response = (
            supabase
            .table("courses")
            .select("*")
            .eq("id", course_id)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Course not found"
            )

        return {
            "success": True,
            "course": response.data[0]
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch course: {str(e)}"
        )


# --------------------------------------------------
# GET COURSE LESSONS
# --------------------------------------------------

@router.get("/{course_id}/lessons")
def get_course_lessons(course_id: int):

    try:

        # ------------------------------------------
        # Check course exists
        # ------------------------------------------

        course_response = (
            supabase
            .table("courses")
            .select("id")
            .eq("id", course_id)
            .execute()
        )

        if not course_response.data:
            raise HTTPException(
                status_code=404,
                detail="Course not found"
            )

        # ------------------------------------------
        # Get lessons
        # ------------------------------------------

        response = (
            supabase
            .table("course_lessons")
            .select("*")
            .eq("course_id", course_id)
            .order("lesson_order")
            .execute()
        )

        return {
            "success": True,
            "course_id": course_id,
            "lessons": response.data
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch course lessons: {str(e)}"
        )


# --------------------------------------------------
# GET SINGLE LESSON
# --------------------------------------------------

@router.get("/{course_id}/lessons/{lesson_id}")
def get_lesson(
    course_id: int,
    lesson_id: int
):

    try:

        # ------------------------------------------
        # Check course exists
        # ------------------------------------------

        course_response = (
            supabase
            .table("courses")
            .select("id")
            .eq("id", course_id)
            .execute()
        )

        if not course_response.data:
            raise HTTPException(
                status_code=404,
                detail="Course not found"
            )

        # ------------------------------------------
        # Get lesson
        # ------------------------------------------

        response = (
            supabase
            .table("course_lessons")
            .select("*")
            .eq("id", lesson_id)
            .eq("course_id", course_id)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Lesson not found"
            )

        return {
            "success": True,
            "lesson": response.data[0]
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch lesson: {str(e)}"
        )