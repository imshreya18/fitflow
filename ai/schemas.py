# from pydantic import BaseModel, Field
# from typing import List, Optional


# class WorkoutPlanRequest(BaseModel):
#     goal: str
#     fitness_level: str
#     available_time: int = Field(gt=0)
#     interests: List[str]
#     workout_frequency: int = Field(gt=0, le=7)
#     workout_history: Optional[List[str]] = None
#     current_progress: Optional[str] = None
#     current_streak: Optional[int] = None


# class Exercise(BaseModel):
#     name: str
#     duration_minutes: int
#     instructions: str


# class WorkoutDay(BaseModel):
#     day: str
#     focus: str
#     duration_minutes: int
#     exercises: List[Exercise]


# class WorkoutPlanResponse(BaseModel):
#     plan_name: str
#     goal: str
#     fitness_level: str
#     weekly_frequency: int
#     workouts: List[WorkoutDay]

from typing import List, Optional, Literal
from pydantic import BaseModel, Field, model_validator
# from pydantic import BaseModel, Field


# =========================
# INPUT SCHEMA
# =========================

class WorkoutPlanRequest(BaseModel):
    goal: str
    fitness_level: str = "Beginner"
    available_time: int = Field(default=20, gt=0)
    interests: List[str] = Field(default_factory=list)
    workout_frequency: int = Field(default=3, ge=1, le=7)

    workout_history: Optional[List[str]] = None
    current_progress: Optional[str] = None
    current_streak: Optional[int] = None

    user_message: Optional[str] = None


# =========================
# OUTPUT SCHEMAS
# =========================

class TimeBreakdown(BaseModel):
    warm_up: int = Field(ge=0)
    main: int = Field(ge=0)
    cooldown: int = Field(ge=0)


class Exercise(BaseModel):
    name: str
    duration_or_reps: str
    instructions: str


class WorkoutDay(BaseModel):
    day: str

    type: Literal[
        "workout",
        "rest",
        "active_recovery"
    ]

    focus: str

    total_duration_minutes: int = Field(ge=0)

    time_breakdown: TimeBreakdown

    exercises: List[Exercise] = Field(default_factory=list)

    coach_note: Optional[str] = None

    @model_validator(mode="after")
    def validate_time(self):
        breakdown_total = (
            self.time_breakdown.warm_up
            + self.time_breakdown.main
            + self.time_breakdown.cooldown
        )

        if breakdown_total != self.total_duration_minutes:
            raise ValueError(
                "Time breakdown must equal total_duration_minutes"
            )

        return self

    @model_validator(mode="after")
    def validate_day(self):
        if self.type == "rest":
            if self.exercises:
                raise ValueError(
                    "Rest days cannot contain exercises"
                )

            if self.total_duration_minutes != 0:
                raise ValueError(
                    "Rest days must have 0 total duration"
                )

        return self


class WorkoutPlanResponse(BaseModel):
    medical_flag: bool

    medical_message: Optional[str] = None

    plan_summary: str

    week: List[WorkoutDay]