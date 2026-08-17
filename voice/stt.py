from faster_whisper import WhisperModel


# Load the Whisper model once when the module starts
model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8"
)


def transcribe_audio(audio_path: str) -> str:
    """
    Transcribe an audio file using Faster-Whisper.
    Returns the complete transcribed text.
    """

    segments, info = model.transcribe(
        audio_path,
        beam_size=5
    )

    text = " ".join(segment.text.strip() for segment in segments)

    return text.strip()