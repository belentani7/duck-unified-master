import io
import sys
from pathlib import Path
from starlette.datastructures import UploadFile

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import backend.main as core

result = core.upload_delivery(UploadFile(filename="mix-v03.wav", file=io.BytesIO(b"audio-bytes")), project_id=7, version="V03")
assert result["projectId"] == 7
assert result["version"] == "V03"
assert result["status"] == "review"
assert Path(result["filePath"]).exists()
Path(result["filePath"]).unlink(missing_ok=True)
print("delivery upload tests passed")
