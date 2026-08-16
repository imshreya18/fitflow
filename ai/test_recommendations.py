# from ai.schemas import WorkoutPlanRequest
# from ai.recommendations import generate_recommendations


# def main():

#     user = WorkoutPlanRequest(
#         goal="Build strength and improve fitness",
#         fitness_level="Beginner",
#         available_time=30,
#         interests=["bodyweight training", "walking"],
#         workout_frequency=4,
#         workout_history=[
#             "Completed Monday full-body workout",
#             "Completed Wednesday upper-body workout",
#         ],
#         current_progress="Consistently completing 3 workouts per week",
#         current_streak=5,
#         user_message="I have been consistent but want to improve my strength.",
#     )

#     result = generate_recommendations(user)

#     print("\n=== FITFLOW AI RECOMMENDATIONS ===\n")
#     print("Summary:")
#     print(result.summary)

#     for recommendation in result.recommendations:
#         print("\nCategory:", recommendation.category)
#         print("Title:", recommendation.title)
#         print("Recommendation:", recommendation.recommendation)
#         print("Reason:", recommendation.reason)
#         print("Priority:", recommendation.priority)


# if __name__ == "__main__":
#     main()

# from ai.schemas import WorkoutPlanRequest
# from ai.recommendations import generate_recommendations


# def main():

#     # Fresh user — no history, progress, or streak
#     user = WorkoutPlanRequest(
#         goal="Build strength",
#         fitness_level="Beginner",
#         available_time=30,
#         interests=["bodyweight training", "walking"],
#         workout_frequency=3,
#         workout_history=None,
#         current_progress=None,
#         current_streak=None,
#         user_message=None,
#     )

#     result = generate_recommendations(user)

#     print("\n=== FITFLOW AI RECOMMENDATIONS ===\n")

#     print("Summary:")
#     print(result.summary)

#     for recommendation in result.recommendations:
#         print("\nCategory:", recommendation.category)
#         print("Title:", recommendation.title)
#         print("Recommendation:", recommendation.recommendation)
#         print("Reason:", recommendation.reason)
#         print("Priority:", recommendation.priority)


# if __name__ == "__main__":
#     main()

from ai.schemas import (
    WorkoutPlanRequest,
    RecommendationItem,
    RecommendationResponse,
)

from ai.recommendations import (
    get_user_status,
    validate_recommendations,
)


def main():

    # =========================
    # NEW USER
    # =========================

    new_user = WorkoutPlanRequest(
        goal="Build strength",
        fitness_level="Beginner",
        available_time=30,
        interests=["bodyweight training"],
        workout_frequency=3,
        workout_history=None,
        current_progress=None,
        current_streak=None,
    )

    valid_new_user_result = RecommendationResponse(
        summary="Start with a simple and sustainable routine.",
        recommendations=[
            RecommendationItem(
                category="workout",
                title="Start with three sessions",
                recommendation="Begin with three manageable workouts per week.",
                reason="A consistent routine is a good foundation for a beginner.",
                priority="high",
            ),
            RecommendationItem(
                category="progress",
                title="Track your baseline",
                recommendation="Record your repetitions during each workout.",
                reason="This gives FitFlow a baseline for future recommendations.",
                priority="medium",
            ),
        ],
    )

    print("\n=== TEST 1: NEW USER ===")

    print("User status:", get_user_status(new_user))

    validate_recommendations(
        valid_new_user_result,
        new_user,
    )

    print("Validation: PASSED")


    # =========================
    # RETURNING USER
    # =========================

    returning_user = WorkoutPlanRequest(
        goal="Build strength",
        fitness_level="Beginner",
        available_time=30,
        interests=["bodyweight training"],
        workout_frequency=3,
        workout_history=[
            "Completed Monday workout",
            "Completed Wednesday workout",
        ],
        current_progress="Improving consistency",
        current_streak=4,
    )

    valid_returning_result = RecommendationResponse(
        summary="Your consistency gives you a good base to progress.",
        recommendations=[
            RecommendationItem(
                category="exercise",
                title="Increase difficulty",
                recommendation="Try a slightly harder variation of your current exercises.",
                reason="Your existing training consistency supports gradual progression.",
                priority="medium",
            ),
        ],
    )

    print("\n=== TEST 2: RETURNING USER ===")

    print("User status:", get_user_status(returning_user))

    validate_recommendations(
        valid_returning_result,
        returning_user,
    )

    print("Validation: PASSED")


    # =========================
    # INVALID NEW USER
    # =========================

    invalid_new_user_result = RecommendationResponse(
        summary="Keep going!",
        recommendations=[
            RecommendationItem(
                category="progress",
                title="Your streak is great",
                recommendation="Your streak shows excellent consistency.",
                reason="You've been consistent with your workouts.",
                priority="high",
            ),
        ],
    )

    print("\n=== TEST 3: INVALID NEW USER ===")

    try:
        validate_recommendations(
            invalid_new_user_result,
            new_user,
        )

        print("Validation: FAILED")
        print("The invalid recommendation was incorrectly accepted.")

    except ValueError as error:
        print("Validation correctly rejected the result.")
        print("Reason:", error)


if __name__ == "__main__":
    main()