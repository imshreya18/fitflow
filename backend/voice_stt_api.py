# from ai.coach import generate_coach_response
# from ai.schemas import WorkoutPlanRequest


# from fastapi import FastAPI, UploadFile, File
# from pathlib import Path
# import tempfile

# from voice.stt import transcribe_audio


# app = FastAPI(title="FitFlow Voice STT API")


# @app.post("/voice/coach")
# async def voice_coach(file: UploadFile = File(...)):
#     """
#     Receive voice input, transcribe it, and send the
#     transcription to the existing FitFlow AI Coach.
#     """

#     suffix = Path(file.filename).suffix or ".wav"

#     with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
#         temp_file.write(await file.read())
#         temp_path = temp_file.name

#     try:
#         # Speech → text
#         text = transcribe_audio(temp_path)

#         # Temporary test profile.
#         # Later this will come from the actual logged-in user.
#         user = WorkoutPlanRequest(
#             goal="general fitness",
#             fitness_level="Beginner",
#             available_time=30,
#         )

#         # Text → existing AI Coach
#         coach_response = generate_coach_response(
#             user=user,
#             message=text,
#             conversation_history=None,
#         )

#         return {
#             "text": text,
#             "coach_response": coach_response.model_dump(),
#         }

#     finally:
#         Path(temp_path).unlink(missing_ok=True)

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import tempfile

from voice.stt import transcribe_audio
from ai.coach import generate_coach_response
from ai.schemas import WorkoutPlanRequest


app = FastAPI(title="FitFlow Voice STT API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/frontend", StaticFiles(directory="frontend", html=True), name="frontend")

@app.post("/voice/transcribe")
async def transcribe_voice(file: UploadFile = File(...)):
    """
    Receive an audio file and return its transcription.
    """

    suffix = Path(file.filename).suffix or ".wav"

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        temp_file.write(await file.read())
        temp_path = temp_file.name

    try:
        text = transcribe_audio(temp_path)

        return {
            "text": text
        }

    finally:
        Path(temp_path).unlink(missing_ok=True)


@app.post("/voice/coach")
async def voice_coach(file: UploadFile = File(...)):
    """
    Receive voice input, transcribe it, and send the
    transcription to the existing FitFlow AI Coach.
    """

    suffix = Path(file.filename).suffix or ".wav"

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        temp_file.write(await file.read())
        temp_path = temp_file.name

    try:
        # Speech → text
        text = transcribe_audio(temp_path)

        # Temporary test profile.
        # Later this will come from the actual logged-in user.
        user = WorkoutPlanRequest(
            goal="general fitness",
            fitness_level="Beginner",
            available_time=30,
        )

        # Text → existing AI Coach
        coach_response = generate_coach_response(
            user=user,
            message=text,
            conversation_history=None,
        )

        return {
            "text": text,
            "coach_response": coach_response.model_dump(),
        }

    finally:
        Path(temp_path).unlink(missing_ok=True)