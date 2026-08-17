from faster_whisper import WhisperModel

AUDIO_FILE = "voice/voice_test3.mp3"

print("Loading Whisper model...")

model = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8",
)

print("Transcribing...")

segments, info = model.transcribe(
    AUDIO_FILE,
    language="en",
)

print("\n--- TRANSCRIPT ---")

for segment in segments:
    print(segment.text)

print("------------------")
print(f"Detected language: {info.language}")