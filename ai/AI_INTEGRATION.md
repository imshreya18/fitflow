# FitFlow AI Integration Guide

## AI Modules

The AI layer currently provides three features:

1. Workout Plan Generation
2. AI Recommendations
3. AI Coach

---

## 1. Workout Plan

Backend should collect the user's fitness information and create a
`WorkoutPlanRequest`.

Then call:

```python
from ai.workout_plan import generate_workout_plan

result = generate_workout_plan(user)

# THE RESULT IS A WrokoutPlanResponse