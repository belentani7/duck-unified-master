import io
import math
import sys
import time
import wave
from pathlib import Path
from unittest.mock import patch
from starlette.datastructures import UploadFile

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import backend.main as core


def wait_for(task_id: str, wanted: str, limit: int = 80):
    seen = set()
    for _ in range(limit):
        current = next((item for item in core.audio_tasks() if item["id"] == task_id), None)
        if current:
            seen.add(current.get("status"))
            if current.get("status") == wanted:
                return seen
        time.sleep(0.02)
    return seen


def valid_wav():
    output = io.BytesIO()
    with wave.open(output, "wb") as wav:
        wav.setnchannels(1); wav.setsampwidth(2); wav.setframerate(22050)
        frames = [int(0.2 * 32767 * math.sin(2 * math.pi * 440 * index / 22050)) for index in range(22050)]
        wav.writeframes(b"".join(frame.to_bytes(2, "little", signed=True) for frame in frames))
    output.seek(0)
    return output

created = core.create_audio_task()
assert created["kind"] == "audio_analysis" and created["status"] == "queued"
seen_processing = wait_for(created["id"], "processing")
assert "processing" in seen_processing
seen_completed = wait_for(created["id"], "completed")
assert "completed" in seen_completed

failed = core.create_audio_task(simulate_error=True)
seen_error = wait_for(failed["id"], "error")
assert "error" in seen_error

success = core.analyze_audio(UploadFile(filename="probe.wav", file=valid_wav()))
assert success["status"] == "ok"
for field in ("lufs", "bpm", "key", "duration"):
    assert field in success

with patch.dict(sys.modules, {"librosa": None, "soundfile": None, "numpy": None}):
    unavailable = core.analyze_audio(UploadFile(filename="probe.wav", file=io.BytesIO(b"not-a-real-audio-file")))
assert unavailable["status"] == "unavailable"
print("audio task and analyze endpoint tests passed")
