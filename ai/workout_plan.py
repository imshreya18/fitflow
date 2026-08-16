# import os

# from dotenv import load_dotenv
# from google import genai

# from ai.prompts import WORKOUT_PLAN_PROMPT
# from ai.schemas import WorkoutPlanRequest, WorkoutPlanResponse


# load_dotenv()

# api_key = os.getenv("GEMINI_API_KEY")

# if not api_key:
#     raise RuntimeError("GEMINI_API_KEY not found in .env")

# client = genai.Client(api_key=api_key)


# # def build_workout_prompt(user: WorkoutPlanRequest) -> str:
# #     return WORKOUT_PLAN_PROMPT.format(
# #         goal=user.goal,
# #         fitness_level=user.fitness_level,
# #         available_time=user.available_time,
# #         interests=", ".join(user.interests),
# #         workout_frequency=user.workout_frequency,
# #         workout_history=user.workout_history or "No workout history available",
# #         current_progress=user.current_progress or "No progress information available",
# #         current_streak=user.current_streak or 0,
# #     )
# def build_workout_prompt(user: WorkoutPlanRequest) -> str:
#     return WORKOUT_PLAN_PROMPT.format(
#         goal=user.goal,
#         fitness_level=user.fitness_level,
#         available_time=user.available_time,
#         interests=", ".join(user.interests) if user.interests else "None",
#         workout_frequency=user.workout_frequency,
#         workout_history=user.workout_history or "None",
#         current_progress=user.current_progress or "None",
#         current_streak=user.current_streak or 0,
#         user_message=user.user_message or "None",
#     )


# # def generate_workout_plan(user: WorkoutPlanRequest) -> WorkoutPlanResponse:
# #     prompt = build_workout_prompt(user)

# #     response = client.models.generate_content(
# #         model="gemini-3.5-flash",
# #         contents=prompt,
# #         config={
# #             "response_mime_type": "application/json",
# #             "response_schema": WorkoutPlanResponse,
# #         },
# #     )

# #     if not response.text:
# #         raise RuntimeError("Gemini returned an empty response")

# #     return WorkoutPlanResponse.model_validate_json(response.text)

# def generate_workout_plan(
#     user: WorkoutPlanRequest
# ) -> WorkoutPlanResponse:

#     prompt = build_workout_prompt(user)

#     response = client.models.generate_content(
#         model="gemini-3.5-flash",
#         contents=prompt,
#         config={
#             "response_mime_type": "application/json",
#             "response_schema": WorkoutPlanResponse,
#         },
#     )

#     if not response.text:
#         raise RuntimeError("Gemini returned an empty response")

#     return WorkoutPlanResponse.model_validate_json(response.text)

import os

from dotenv import load_dotenv
from google import genai

from ai.prompts import WORKOUT_PLAN_PROMPT
from ai.schemas import WorkoutPlanRequest, WorkoutPlanResponse


# =========================
# GEMINI CLIENT
# =========================

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY not found in .env")

client = genai.Client(api_key=api_key)


# =========================
# PROMPT BUILDER
# =========================

def build_workout_prompt(user: WorkoutPlanRequest) -> str:
    return WORKOUT_PLAN_PROMPT.format(
        goal=user.goal,
        fitness_level=user.fitness_level,
        available_time=user.available_time,
        interests=", ".join(user.interests) if user.interests else "None",
        workout_frequency=user.workout_frequency,
        workout_history=user.workout_history or "None",
        current_progress=user.current_progress or "None",
        current_streak=user.current_streak or 0,
        user_message=user.user_message or "None",
    )


# =========================
# BUSINESS VALIDATION
# =========================

def validate_workout_plan(
    plan: WorkoutPlanResponse,
    user: WorkoutPlanRequest,
) -> None:

    # -------------------------
    # Medical safety
    # -------------------------

    if plan.medical_flag:
        if plan.week:
            raise ValueError(
                "Medical response must contain an empty week"
            )

        if not plan.medical_message:
            raise ValueError(
                "Medical response must contain medical_message"
            )

        return

    # -------------------------
    # Week validation
    # -------------------------

    if len(plan.week) != 7:
        raise ValueError(
            f"Expected exactly 7 days, got {len(plan.week)}"
        )

    # -------------------------
    # Workout frequency
    # -------------------------

    workout_days = [
        day for day in plan.week
        if day.type == "workout"
    ]

    if len(workout_days) != user.workout_frequency:
        raise ValueError(
            f"Expected {user.workout_frequency} workout days, "
            f"got {len(workout_days)}"
        )

    # -------------------------
    # Validate each day
    # -------------------------

    for day in plan.week:

        # Workout days
        if day.type == "workout":

            if not day.exercises:
                raise ValueError(
                    f"{day.day} is a workout day but has no exercises"
                )

            # Available time limit
            if day.total_duration_minutes > user.available_time:
                raise ValueError(
                    f"{day.day} exceeds user's available time"
                )

            # Time breakdown
            breakdown_total = (
                day.time_breakdown.warm_up
                + day.time_breakdown.main
                + day.time_breakdown.cooldown
            )

            if breakdown_total != day.total_duration_minutes:
                raise ValueError(
                    f"{day.day}: time breakdown does not match "
                    f"total duration"
                )

        # Rest days
        elif day.type == "rest":

            if day.total_duration_minutes != 0:
                raise ValueError(
                    f"{day.day}: rest day must have 0 minutes"
                )

            if day.exercises:
                raise ValueError(
                    f"{day.day}: rest day cannot contain exercises"
                )

        # Active recovery
        elif day.type == "active_recovery":

            if day.total_duration_minutes > user.available_time:
                raise ValueError(
                    f"{day.day}: active recovery exceeds available time"
                )


# =========================
# GENERATE WORKOUT PLAN
# =========================

def generate_workout_plan(
    user: WorkoutPlanRequest
) -> WorkoutPlanResponse:

    prompt = build_workout_prompt(user)

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": WorkoutPlanResponse,
        },
    )

    if not response.text:
        raise RuntimeError(
            "Gemini returned an empty response"
        )

    # Convert Gemini JSON → Pydantic object
    plan = WorkoutPlanResponse.model_validate_json(
        response.text
    )

    # Validate FitFlow-specific rules
    validate_workout_plan(plan, user)

    return plan