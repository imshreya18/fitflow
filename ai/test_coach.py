# from ai.schemas import WorkoutPlanRequest
# from ai.coach import build_coach_prompt


# def main():

#     user = WorkoutPlanRequest(
#         goal="Build strength",
#         fitness_level="Beginner",
#         available_time=30,
#         interests=["bodyweight training"],
#         workout_frequency=3,
#         workout_history=None,
#         current_progress=None,
#         current_streak=None,
#     )

#     message = "I only have 15 minutes today."

#     prompt = build_coach_prompt(
#         user=user,
#         message=message,
#     )

#     print("\n=== FITFLOW AI COACH PROMPT TEST ===\n")
#     print(prompt)

                                                                                #gemini api (paid)
# if __name__ == "__main__":
#     main()        
#                                             

# from ai.schemas import (
#     CoachResponse,
#     CoachAction,
# )


# def test_response(
#     name: str,
#     response: CoachResponse,
# ):
#     print(f"\n=== {name} ===")
#     print("Message:", response.message)
#     print("Action:", response.action.action_type)
#     print("Button:", response.action.label)


# def main():

#     # =========================
#     # TEST 1: MODIFY WORKOUT
#     # =========================

#     modify_response = CoachResponse(
#         message=(
#             "I can adapt today's workout to fit your "
#             "15-minute time limit while keeping your goal in mind."
#         ),
#         action=CoachAction(
#             action_type="modify_workout",
#             label="Create 15-minute workout",
#         ),
#     )

#     test_response(
#         "TEST 1: MODIFY WORKOUT",
#         modify_response,
#     )


#     # =========================
#     # TEST 2: APPLY WORKOUT
#     # =========================

#     apply_response = CoachResponse(
#         message=(
#             "Your 15-minute workout is ready to use."
#         ),
#         action=CoachAction(
#             action_type="apply_workout",
#             label="Apply 15-minute workout",
#         ),
#     )

#     test_response(
#         "TEST 2: APPLY WORKOUT",
#         apply_response,
#     )


#     # =========================
#     # TEST 3: NORMAL QUESTION
#     # =========================

#     normal_response = CoachResponse(
#         message=(
#             "To improve your push-ups, focus on controlled "
#             "repetitions and gradually increase your reps."
#         ),
#         action=CoachAction(
#             action_type="none",
#             label="",
#         ),
#     )

#     test_response(
#         "TEST 3: NORMAL QUESTION",
#         normal_response,
#     )


#     # =========================
#     # TEST 4: RECOMMENDATIONS
#     # =========================

#     recommendation_response = CoachResponse(
#         message=(
#             "I can show recommendations based on your "
#             "current fitness goal and progress."
#         ),
#         action=CoachAction(
#             action_type="view_recommendations",
#             label="View recommendations",
#         ),
#     )

#     test_response(
#         "TEST 4: RECOMMENDATIONS",
#         recommendation_response,
#     )


# if __name__ == "__main__":
#     main()

from ai.schemas import WorkoutPlanRequest
from ai.coach import build_coach_prompt


def main():

    user = WorkoutPlanRequest(
        goal="Build strength",
        fitness_level="Beginner",
        available_time=30,
        interests=["bodyweight training"],
        workout_frequency=3,
        workout_history=None,
        current_progress=None,
        current_streak=None,
    )

    conversation_history = [
        {
            "role": "user",
            "content": "I only have 15 minutes today.",
        },
        {
            "role": "assistant",
            "content": "I can adapt today's workout to 15 minutes.",
        },
        {
            "role": "user",
            "content": "Can I do it without equipment?",
        },
    ]

    prompt = build_coach_prompt(
        user=user,
        message="Can I do it without equipment?",
        conversation_history=conversation_history,
    )

    print("\n=== FITFLOW AI COACH CONVERSATION TEST ===\n")

    print(prompt)


if __name__ == "__main__":
    main()