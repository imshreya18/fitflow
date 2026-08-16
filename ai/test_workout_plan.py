# from ai.schemas import WorkoutPlanRequest
# from ai.workout_plan import generate_workout_plan


# def run_test(test_name, user):
#     print("\n" + "=" * 70)
#     print(test_name)
#     print("=" * 70)

#     print("\nINPUT:")
#     print(user.model_dump())

     
#     plan = generate_workout_plan(user)
#     print("\nGENERATED PLAN:")
#     print(plan.model_dump_json(indent=2))

#     print("\nVALIDATION CHECKS:")

#         # Check medical response
#     if plan.medical_flag:
#             print("⚠ Medical flag triggered")
#             print("Medical message:", plan.medical_message)
#             print("Week:", plan.week)

#             assert len(plan.week) == 0, \
#                 "Medical response should have an empty week"

#             print("✓ Medical response is valid")
#             return

#         # Week should contain 7 days
#     assert len(plan.week) == 7, \
#             f"Expected 7 days, got {len(plan.week)}"

#     print("✓ Week contains 7 days")

#     # Count workout days
#     workout_days = [
#         day for day in plan.week
#         if day.type == "workout"
#     ]

#     assert len(workout_days) == user.workout_frequency, \
#         f"Expected {user.workout_frequency} workout days, got {len(workout_days)}"

#     print(
#         f"✓ Workout frequency correct: "
#         f"{len(workout_days)}/{user.workout_frequency}"
#     )

#     # Check each day
#     for day in plan.week:

#         if day.type == "workout":

#             # Total duration must not exceed available time
#             assert day.total_duration_minutes <= user.available_time, \
#                 f"{day.day} exceeds available time"

#             # Time breakdown should add up
#             breakdown_total = (
#                 day.time_breakdown.warm_up
#                 + day.time_breakdown.main
#                 + day.time_breakdown.cooldown
#             )

#             assert breakdown_total == day.total_duration_minutes, \
#                 f"{day.day}: time breakdown does not match total duration"

#             print(
#                 f"✓ {day.day}: "
#                 f"{day.total_duration_minutes} min"
#             )

#         elif day.type == "rest":

#             assert day.total_duration_minutes == 0, \
#                 f"{day.day} rest day should have 0 minutes"

#             assert len(day.exercises) == 0, \
#                 f"{day.day} rest day should have no exercises"

#             print(f"✓ {day.day}: Rest day")

#         elif day.type == "active_recovery":

#             assert day.total_duration_minutes <= user.available_time, \
#                 f"{day.day} active recovery exceeds available time"

#             print(
#                 f"✓ {day.day}: "
#                 f"Active recovery "
#                 f"({day.total_duration_minutes} min)"
#             )

#     print("\n✅ TEST PASSED")


# # ============================================================
# # TEST 1 — BEGINNER STRENGTH
# # ============================================================

# run_test(
#     "TEST 1 — Beginner Strength",
#     WorkoutPlanRequest(
#         goal="Build strength",
#         fitness_level="Beginner",
#         available_time=30,
#         interests=["home workout", "bodyweight exercises"],
#         workout_frequency=4,
#         workout_history=None,
#         current_progress=None,
#         current_streak=None,
#         user_message=None,
#     )
# )


# # ============================================================
# # TEST 2 — SHORT WEIGHT LOSS WORKOUT
# # ============================================================

# run_test(
#     "TEST 2 — 15 Minute Weight Loss",
#     WorkoutPlanRequest(
#         goal="Lose weight",
#         fitness_level="Beginner",
#         available_time=15,
#         interests=["cardio", "home workout"],
#         workout_frequency=3,
#         workout_history=None,
#         current_progress=None,
#         current_streak=None,
#         user_message="I only have a few minutes each day.",
#     )
# )


# # ============================================================
# # TEST 3 — ADVANCED FITNESS
# # ============================================================

# run_test(
#     "TEST 3 — Advanced Fitness",
#     WorkoutPlanRequest(
#         goal="Improve fitness",
#         fitness_level="Advanced",
#         available_time=60,
#         interests=["strength training", "cardio"],
#         workout_frequency=5,
#         workout_history=[
#             "Completed previous workouts consistently"
#         ],
#         current_progress="Good endurance and strength",
#         current_streak=12,
#         user_message="I want a challenging plan.",
#     )
# )


# # ============================================================
# # TEST 4 — FLEXIBILITY
# # ============================================================

# run_test(
#     "TEST 4 — Flexibility",
#     WorkoutPlanRequest(
#         goal="Improve flexibility",
#         fitness_level="Intermediate",
#         available_time=45,
#         interests=["yoga", "stretching"],
#         workout_frequency=4,
#         workout_history=None,
#         current_progress=None,
#         current_streak=5,
#         user_message="I enjoy yoga and stretching.",
#     )
# )


# # ============================================================
# # TEST 5 — MEDICAL SAFETY
# # ============================================================

# run_test(
#     "TEST 5 — Medical Safety",
#     WorkoutPlanRequest(
#         goal="Build strength",
#         fitness_level="Beginner",
#         available_time=30,
#         interests=["home workout"],
#         workout_frequency=3,
#         workout_history=None,
#         current_progress=None,
#         current_streak=None,
#         user_message="I have pain in my ankle.",
#     )
# )

# TEST ACTUAL GEMINI GENERATION AND INTEGRATION ☝🏼

# THIS IS TEST FOR APPLICATION RULES WITHOUT GEMINI API FREE QUOTA 👇🏼

from ai.schemas import (
    WorkoutPlanRequest,
    WorkoutPlanResponse,
    WorkoutDay,
    Exercise,
    TimeBreakdown,
)
from ai.workout_plan import validate_workout_plan


def create_valid_plan(user):
    """
    Creates a deterministic sample plan locally.
    No Gemini API call is made.
    """

    week = []

    # Create requested number of workout days
    for i in range(user.workout_frequency):

        # Keep the session within user's available time
        total_time = user.available_time

        # For very short sessions
        if total_time < 10:
            warm_up = total_time
            main = 0
            cooldown = 0
        else:
            warm_up = max(2, int(total_time * 0.15))
            cooldown = max(1, int(total_time * 0.10))
            main = total_time - warm_up - cooldown

        week.append(
            WorkoutDay(
                day=f"Day {i + 1}",
                type="workout",
                focus=user.goal,
                total_duration_minutes=total_time,
                time_breakdown=TimeBreakdown(
                    warm_up=warm_up,
                    main=main,
                    cooldown=cooldown,
                ),
                exercises=[
                    Exercise(
                        name="Bodyweight Exercise",
                        duration_or_reps="3 sets",
                        instructions=(
                            "Perform the exercise with controlled "
                            "movement and proper form."
                        ),
                    )
                ],
                coach_note="Keep going — consistency matters!",
            )
        )

    # Remaining days are rest days
    remaining_days = 7 - user.workout_frequency

    for i in range(remaining_days):
        week.append(
            WorkoutDay(
                day=f"Day {user.workout_frequency + i + 1}",
                type="rest",
                focus="Recovery",
                total_duration_minutes=0,
                time_breakdown=TimeBreakdown(
                    warm_up=0,
                    main=0,
                    cooldown=0,
                ),
                exercises=[],
                coach_note="Take time to recover and recharge.",
            )
        )

    return WorkoutPlanResponse(
        medical_flag=False,
        medical_message=None,
        plan_summary=(
            f"A personalized {user.goal.lower()} plan "
            f"for {user.fitness_level.lower()} level."
        ),
        week=week,
    )


def create_medical_response():
    """
    Creates a deterministic medical-safety response.
    No Gemini API call.
    """

    return WorkoutPlanResponse(
        medical_flag=True,
        medical_message=(
            "Because you mentioned pain, please consult a "
            "qualified healthcare professional before continuing."
        ),
        plan_summary="Workout paused for safety.",
        week=[],
    )


def run_test(test_name, user, medical=False):

    print("\n" + "=" * 70)
    print(test_name)
    print("=" * 70)

    print("\nINPUT:")
    print(user.model_dump())

    # --------------------------------------------------
    # Generate local test response
    # --------------------------------------------------

    if medical:
        plan = create_medical_response()
    else:
        plan = create_valid_plan(user)

    print("\nLOCAL TEST PLAN:")
    print(plan.model_dump_json(indent=2))

    print("\nVALIDATION CHECKS:")

    # --------------------------------------------------
    # Medical response
    # --------------------------------------------------

    if plan.medical_flag:

        print("⚠ Medical flag triggered")

        assert len(plan.week) == 0, (
            "Medical response should have an empty week"
        )

        assert plan.medical_message, (
            "Medical response should contain a message"
        )

        print("✓ Medical response is valid")
        print("\n✅ TEST PASSED")
        return

    # --------------------------------------------------
    # Validate using actual application validation
    # --------------------------------------------------

    validate_workout_plan(plan, user)

    print("✓ FitFlow business validation passed")

    # --------------------------------------------------
    # Check 7-day week
    # --------------------------------------------------

    assert len(plan.week) == 7, (
        f"Expected 7 days, got {len(plan.week)}"
    )

    print("✓ Week contains 7 days")

    # --------------------------------------------------
    # Check workout frequency
    # --------------------------------------------------

    workout_days = [
        day for day in plan.week
        if day.type == "workout"
    ]

    assert len(workout_days) == user.workout_frequency, (
        f"Expected {user.workout_frequency} workout days, "
        f"got {len(workout_days)}"
    )

    print(
        f"✓ Workout frequency correct: "
        f"{len(workout_days)}/{user.workout_frequency}"
    )

    # --------------------------------------------------
    # Check each day
    # --------------------------------------------------

    for day in plan.week:

        if day.type == "workout":

            assert day.total_duration_minutes <= user.available_time, (
                f"{day.day} exceeds available time"
            )

            breakdown_total = (
                day.time_breakdown.warm_up
                + day.time_breakdown.main
                + day.time_breakdown.cooldown
            )

            assert breakdown_total == day.total_duration_minutes, (
                f"{day.day}: time breakdown does not match "
                f"total duration"
            )

            assert len(day.exercises) > 0, (
                f"{day.day} has no exercises"
            )

            print(
                f"✓ {day.day}: "
                f"{day.total_duration_minutes} min"
            )

        elif day.type == "rest":

            assert day.total_duration_minutes == 0, (
                f"{day.day} rest day should have 0 minutes"
            )

            assert len(day.exercises) == 0, (
                f"{day.day} rest day should have no exercises"
            )

            print(f"✓ {day.day}: Rest day")

        elif day.type == "active_recovery":

            assert day.total_duration_minutes <= user.available_time, (
                f"{day.day} active recovery exceeds available time"
            )

            print(
                f"✓ {day.day}: Active recovery "
                f"({day.total_duration_minutes} min)"
            )

    print("\n✅ TEST PASSED")


# ============================================================
# TEST 1 — BEGINNER STRENGTH
# ============================================================

run_test(
    "TEST 1 — Beginner Strength",
    WorkoutPlanRequest(
        goal="Build strength",
        fitness_level="Beginner",
        available_time=30,
        interests=["home workout", "bodyweight exercises"],
        workout_frequency=4,
        workout_history=None,
        current_progress=None,
        current_streak=None,
        user_message=None,
    )
)


# ============================================================
# TEST 2 — SHORT WEIGHT LOSS
# ============================================================

run_test(
    "TEST 2 — 15 Minute Weight Loss",
    WorkoutPlanRequest(
        goal="Lose weight",
        fitness_level="Beginner",
        available_time=15,
        interests=["cardio", "home workout"],
        workout_frequency=3,
        workout_history=None,
        current_progress=None,
        current_streak=None,
        user_message="I only have a few minutes each day.",
    )
)


# ============================================================
# TEST 3 — ADVANCED FITNESS
# ============================================================

run_test(
    "TEST 3 — Advanced Fitness",
    WorkoutPlanRequest(
        goal="Improve fitness",
        fitness_level="Advanced",
        available_time=60,
        interests=["strength training", "cardio"],
        workout_frequency=5,
        workout_history=[
            "Completed previous workouts consistently"
        ],
        current_progress="Good endurance and strength",
        current_streak=12,
        user_message="I want a challenging plan.",
    )
)


# ============================================================
# TEST 4 — FLEXIBILITY
# ============================================================

run_test(
    "TEST 4 — Flexibility",
    WorkoutPlanRequest(
        goal="Improve flexibility",
        fitness_level="Intermediate",
        available_time=45,
        interests=["yoga", "stretching"],
        workout_frequency=4,
        workout_history=None,
        current_progress=None,
        current_streak=5,
        user_message="I enjoy yoga and stretching.",
    )
)


# ============================================================
# TEST 5 — MEDICAL SAFETY
# ============================================================

run_test(
    "TEST 5 — Medical Safety",
    WorkoutPlanRequest(
        goal="Build strength",
        fitness_level="Beginner",
        available_time=30,
        interests=["home workout"],
        workout_frequency=3,
        workout_history=None,
        current_progress=None,
        current_streak=None,
        user_message="I have pain in my ankle.",
    ),
    medical=True,
)