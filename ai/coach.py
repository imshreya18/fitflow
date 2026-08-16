# import os

# from dotenv import load_dotenv
# from google import genai

# from ai.schemas import (
#     WorkoutPlanRequest,
#     CoachResponse,
# )

# from ai.recommendations import get_user_status
# from ai.prompts import COACH_SYSTEM_PROMPT


# # =========================
# # GEMINI CLIENT
# # =========================

# load_dotenv()

# api_key = os.getenv("GEMINI_API_KEY")

# if not api_key:
#     raise RuntimeError(
#         "GEMINI_API_KEY is not set. "
#         "Please check your .env file."
#     )

# client = genai.Client(api_key=api_key)


# # =========================
# # BUILD COACH PROMPT
# # =========================

# def build_coach_prompt(
#     user: WorkoutPlanRequest,
#     message: str,
# ) -> str:

#     return COACH_SYSTEM_PROMPT.format(
#         goal=user.goal,
#         fitness_level=user.fitness_level,
#         available_time=user.available_time,
#         interests=", ".join(user.interests)
#         if user.interests else "None",
#         workout_frequency=user.workout_frequency,
#         workout_history=user.workout_history or "None",
#         current_progress=user.current_progress or "None",
#         current_streak=user.current_streak or 0,
#         user_status=get_user_status(user),
#         message=message,
#     )


# # =========================
# # GENERATE COACH RESPONSE
# # =========================

# def generate_coach_response(
#     user: WorkoutPlanRequest,
#     message: str,
# ) -> CoachResponse:

#     prompt = build_coach_prompt(
#         user=user,
#         message=message,
#     )

#     response = client.models.generate_content(
#         model="gemini-3.5-flash",
#         contents=prompt,
#         config={
#             "response_mime_type": "application/json",
#             "response_schema": CoachResponse,
#         },
#     )

#     if not response.text:
#         raise RuntimeError(
#             "Gemini returned an empty coach response"
#         )

#     result = CoachResponse.model_validate_json(
#         response.text
#     )

#     return result

import os

from dotenv import load_dotenv
from google import genai

from ai.schemas import WorkoutPlanRequest, CoachResponse
from ai.recommendations import get_user_status
from ai.prompts import COACH_SYSTEM_PROMPT


load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError(
        "GEMINI_API_KEY is not set. Please check your .env file."
    )

client = genai.Client(api_key=api_key)


def build_coach_prompt(
    user: WorkoutPlanRequest,
    message: str,
    conversation_history: list[dict] | None = None,
) -> str:

    history_text = "No previous conversation."

    if conversation_history:
        history_text = "\n".join(
            f"{item['role'].upper()}: {item['content']}"
            for item in conversation_history[-6:]
        )

    return COACH_SYSTEM_PROMPT.format(
        goal=user.goal,
        fitness_level=user.fitness_level,
        available_time=user.available_time,
        interests=", ".join(user.interests)
        if user.interests else "None",
        workout_frequency=user.workout_frequency,
        workout_history=user.workout_history or "None",
        current_progress=user.current_progress or "None",
        current_streak=user.current_streak or 0,
        user_status=get_user_status(user),
        message=message,
    ) + f"""

CONVERSATION HISTORY:
{history_text}
"""


def generate_coach_response(
    user: WorkoutPlanRequest,
    message: str,
    conversation_history: list[dict] | None = None,
) -> CoachResponse:

    prompt = build_coach_prompt(
        user=user,
        message=message,
        conversation_history=conversation_history,
    )

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": CoachResponse,
        },
    )

    if not response.text:
        raise RuntimeError(
            "Gemini returned an empty coach response"
        )

    return CoachResponse.model_validate_json(response.text)