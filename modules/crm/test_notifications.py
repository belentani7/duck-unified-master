import io
import sqlite3
import sys
import tempfile
from pathlib import Path
from starlette.datastructures import UploadFile
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import backend.main as core

with tempfile.TemporaryDirectory() as folder:
    core.DB = Path(folder) / "notifications.sqlite3"
    with sqlite3.connect(core.DB) as conn:
        conn.execute("CREATE TABLE notifications (id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT NOT NULL, message TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)")
    core.add_notification("test", "Evento inicial")
    core.upload_delivery(UploadFile(filename="notify.wav", file=io.BytesIO(b"bytes")), project_id=1, version="V01")
    rows = core.notifications()
    assert rows[0]["message"].startswith("Nova versão")
    assert any(row["message"] == "Evento inicial" for row in rows)
print("notification tests passed")
