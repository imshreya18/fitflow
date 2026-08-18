from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Depends

from app.database.connection import supabase
from app.auth import get_current_user


router = APIRouter()


# --------------------------------------------------
# ENROLL IN A COURSE
# --------------------------------------------------

@router.post("/courses/{course_id}/enroll")
def enroll_in_course(
    course_id: int,
    user=Depends(get_current_user)
):

    user_id = str(user.id)

    try:

        # ------------------------------------------
        # 1. Check whether course exists
        # ------------------------------------------

        course = (
            supabase
            .table("courses")
            .select("id")
            .eq("id", course_id)
            .execute()
        )

        if not course.data:
            raise HTTPException(
                status_code=404,
                detail="Course not found"
            )

        # ------------------------------------------
        # 2. Check whether already enrolled
        # ------------------------------------------

        existing = (
            supabase
            .table("course_enrollments")
            .select("*")
            .eq("user_id", user_id)
            .eq("course_id", course_id)
            .execute()
        )

        if existing.data:
            return {
                "success": True,
                "message": "Already enrolled",
                "enrollment": existing.data[0]
            }

        # ------------------------------------------
        # 3. Create enrollment
        # ------------------------------------------

        response = (
            supabase
            .table("course_enrollments")
            .insert({
                "user_id": user_id,
                "course_id": course_id,
                "progress": 0
            })
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=500,
                detail="Failed to create enrollment"
            )

        return {
            "success": True,
            "message": "Successfully enrolled",
            "enrollment": response.data[0]
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to enroll: {str(e)}"
        )


# --------------------------------------------------
# GET COURSE PROGRESS
# --------------------------------------------------

@router.get("/courses/{course_id}/progress")
def get_course_progress(
    course_id: int,
    user=Depends(get_current_user)
):

    user_id = str(user.id)

    try:

        # ------------------------------------------
        # 1. Check course exists
        # ------------------------------------------

        course = (
            supabase
            .table("courses")
            .select("id")
            .eq("id", course_id)
            .execute()
        )

        if not course.data:
            raise HTTPException(
                status_code=404,
                detail="Course not found"
            )

        # ------------------------------------------
        # 2. Get enrollment
        # ------------------------------------------

        response = (
            supabase
            .table("course_enrollments")
            .select("*")
            .eq("user_id", user_id)
            .eq("course_id", course_id)
            .execute()
        )

        # ------------------------------------------
        # User hasn't enrolled
        # ------------------------------------------

        if not response.data:
            return {
                "success": True,
                "enrolled": False,
                "progress": 0
            }

        enrollment = response.data[0]

        return {
            "success": True,
            "enrolled": True,
            "progress": enrollment.get("progress", 0),
            "enrollment": enrollment
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get progress: {str(e)}"
        )


# --------------------------------------------------
# COMPLETE A LESSON
# --------------------------------------------------

@router.post("/courses/{course_id}/lessons/{lesson_id}/complete")
def complete_lesson(
    course_id: int,
    lesson_id: int,
    user=Depends(get_current_user)
):

    user_id = str(user.id)

    try:

        # ------------------------------------------
        # 1. Check whether course exists
        # ------------------------------------------

        course = (
            supabase
            .table("courses")
            .select("id")
            .eq("id", course_id)
            .execute()
        )

        if not course.data:
            raise HTTPException(
                status_code=404,
                detail="Course not found"
            )

        # ------------------------------------------
        # 2. Check lesson belongs to course
        # ------------------------------------------

        lesson = (
            supabase
            .table("course_lessons")
            .select("*")
            .eq("id", lesson_id)
            .eq("course_id", course_id)
            .execute()
        )

        if not lesson.data:
            raise HTTPException(
                status_code=404,
                detail="Lesson not found for this course"
            )

        # ------------------------------------------
        # 3. Check whether user is enrolled
        # ------------------------------------------

        enrollment = (
            supabase
            .table("course_enrollments")
            .select("*")
            .eq("user_id", user_id)
            .eq("course_id", course_id)
            .execute()
        )

        if not enrollment.data:
            raise HTTPException(
                status_code=400,
                detail="User is not enrolled in this course"
            )

        # ------------------------------------------
        # 4. Current time
        # ------------------------------------------

        completed_at = datetime.now(timezone.utc).isoformat()

        # ------------------------------------------
        # 5. Check existing lesson progress
        # ------------------------------------------

        existing_progress = (
            supabase
            .table("lesson_progress")
            .select("*")
            .eq("user_id", user_id)
            .eq("lesson_id", lesson_id)
            .execute()
        )

        # ------------------------------------------
        # 6. Create or update lesson progress
        # ------------------------------------------

        if existing_progress.data:

            supabase \
                .table("lesson_progress") \
                .update({
                    "completed": True,
                    "completed_at": completed_at
                }) \
                .eq("user_id", user_id) \
                .eq("lesson_id", lesson_id) \
                .execute()

        else:

            supabase \
                .table("lesson_progress") \
                .insert({
                    "user_id": user_id,
                    "lesson_id": lesson_id,
                    "completed": True,
                    "completed_at": completed_at
                }) \
                .execute()

        # ------------------------------------------
        # 7. Get all lessons for course
        # ------------------------------------------

        total_lessons_response = (
            supabase
            .table("course_lessons")
            .select("id")
            .eq("course_id", course_id)
            .execute()
        )

        total_lessons = len(total_lessons_response.data)

        if total_lessons == 0:
            raise HTTPException(
                status_code=400,
                detail="Course has no lessons"
            )

        # ------------------------------------------
        # 8. Get lesson IDs
        # ------------------------------------------

        lesson_ids = [
            lesson_item["id"]
            for lesson_item in total_lessons_response.data
        ]

        # ------------------------------------------
        # 9. Find completed lessons
        # ------------------------------------------

        completed_response = (
            supabase
            .table("lesson_progress")
            .select("lesson_id")
            .eq("user_id", user_id)
            .eq("completed", True)
            .in_("lesson_id", lesson_ids)
            .execute()
        )

        completed_lessons = len(completed_response.data)

        # ------------------------------------------
        # 10. Calculate progress
        # ------------------------------------------

        progress = round(
            (completed_lessons / total_lessons) * 100
        )

        # ------------------------------------------
        # 11. Update course enrollment
        # ------------------------------------------

        enrollment_id = enrollment.data[0]["id"]

        update_data = {
            "progress": progress
        }

        if progress == 100:
            update_data["completed_at"] = completed_at

        supabase \
            .table("course_enrollments") \
            .update(update_data) \
            .eq("id", enrollment_id) \
            .execute()

        # ------------------------------------------
        # 12. Return result
        # ------------------------------------------

        return {
            "success": True,
            "message": "Lesson completed successfully",
            "course_id": course_id,
            "lesson_id": lesson_id,
            "completed_lessons": completed_lessons,
            "total_lessons": total_lessons,
            "progress": progress
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to complete lesson: {str(e)}"
        )