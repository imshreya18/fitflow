import os

from dotenv import load_dotenv
from google import genai

from ai.prompts import RECOMMENDATION_PROMPT
from ai.schemas import (
    RecommendationResponse,
    WorkoutPlanRequest,
)


# =========================
# GEMINI CLIENT
# =========================

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY not found in .env")

client = genai.Client(api_key=api_key)

# =========================
# USER STATUS
# =========================

def get_user_status(user: WorkoutPlanRequest) -> str:
    if (
        not user.workout_history
        and not user.current_progress
        and not user.current_streak
    ):
        return "NEW USER / FRESH START"

    return "RETURNING USER"


# =========================
# PROMPT BUILDER
# =========================

# def build_recommendation_prompt(
#     user: WorkoutPlanRequest,
# ) -> str:

#     return RECOMMENDATION_PROMPT.format(
#         goal=user.goal,
#         fitness_level=user.fitness_level,
#         available_time=user.available_time,
#         interests=", ".join(user.interests)
#         if user.interests else "None",                    # this is for online gemini with api . quota reached!
#         workout_frequency=user.workout_frequency,
#         workout_history=user.workout_history or "None",
#         current_progress=user.current_progress or "None",
#         current_streak=user.current_streak or 0,
#         user_message=user.user_message or "None",
#     )


def build_recommendation_prompt(
    user: WorkoutPlanRequest,
) -> str:

    return RECOMMENDATION_PROMPT.format(
        goal=user.goal,
        fitness_level=user.fitness_level,
        available_time=user.available_time,
        interests=", ".join(user.interests)                                  # without gemini api testing 
        if user.interests else "None",
        workout_frequency=user.workout_frequency,
        workout_history=user.workout_history or "None",
        current_progress=user.current_progress or "None",
        current_streak=user.current_streak or 0,
        user_message=user.user_message or "None",
        user_status=get_user_status(user),
    )


# =========================
# GENERATE RECOMMENDATIONS
# =========================

def generate_recommendations(
    user: WorkoutPlanRequest,
) -> RecommendationResponse:

    prompt = build_recommendation_prompt(user)

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": RecommendationResponse,
        },
    )

    if not response.text:
        raise RuntimeError(
            "Gemini returned an empty response"
        )

    result = RecommendationResponse.model_validate_json(
        response.text
    )

    validate_recommendations(result, user)

    return result


# =========================
# RECOMMENDATION VALIDATION
# =========================

def validate_recommendations(
    result: RecommendationResponse,
    user: WorkoutPlanRequest,
) -> None:

    # Must contain recommendations
    if not result.recommendations:
        raise ValueError(
            "Recommendation response must contain at least one recommendation"
        )

    # Keep output manageable for the frontend
    if len(result.recommendations) > 5:
        raise ValueError(
            "Recommendation response cannot contain more than 5 recommendations"
        )

    # Summary must exist
    if not result.summary.strip():
        raise ValueError(
            "Recommendation summary cannot be empty"
        )

    # New users must not receive recommendations
    # claiming previous progress or achievements.
    if get_user_status(user) == "NEW USER / FRESH START":

        forbidden_phrases = [
            "your streak",
            "you've been consistent",
            "you have improved",
            "your progress shows",
            "you've improved",
            "you've maintained",
        ]

        for recommendation in result.recommendations:

            text = (
                recommendation.recommendation
                + " "
                + recommendation.reason
                + " "
                + recommendation.title
            ).lower()

            for phrase in forbidden_phrases:
                if phrase in text:
                    raise ValueError(
                        f"New-user recommendation contains unsupported "
                        f"progress claim: '{phrase}'"
                    )