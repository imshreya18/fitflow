from ai.schemas import WorkoutPlanRequest


user = WorkoutPlanRequest(
    goal="build strength",
    fitness_level="beginner",
    available_time=30,
    interests=["home workout", "strength training"],
    workout_frequency=4
)

print(user)