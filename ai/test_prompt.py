from ai.schemas import WorkoutPlanRequest
from ai.workout_plan import build_workout_prompt


user = WorkoutPlanRequest(
    goal="build strength",
    fitness_level="beginner",
    available_time=30,
    interests=["home workout", "strength training"],
    workout_frequency=4
)

prompt = build_workout_prompt(user)

print(prompt)