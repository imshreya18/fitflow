import os

from dotenv import load_dotenv
from google import genai

from ai.schemas import WorkoutPlanResponse


load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


response = client.models.generate_content(
    model="gemini-3.5-flash",
    contents="""
Create a simple 4-day beginner strength workout plan.

Each workout should be 30 minutes.

Use beginner-friendly exercises that can be done at home.
""",
    config={
        "response_mime_type": "application/json",
        "response_schema": WorkoutPlanResponse,
    },
)


print("RAW RESPONSE:")
print(response.text)

print("\nVALIDATED RESPONSE:")

plan = WorkoutPlanResponse.model_validate_json(response.text)

print(plan)

# python -m ai.test_gemini_structured
# cd C:\Users\ftt\Documents\GitHub\fitflow