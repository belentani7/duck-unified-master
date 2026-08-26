import sqlite3
import sys
import tempfile
from pathlib import Path
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import backend.main as core

with tempfile.TemporaryDirectory() as folder:
    core.DB = Path(folder) / "test.sqlite3"
    with sqlite3.connect(core.DB) as conn:
        conn.execute("CREATE TABLE plugins (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, format TEXT, license TEXT, sha256 TEXT, static_audit TEXT, manually_approved INTEGER, dependencies TEXT, audit_report TEXT)")
    client = TestClient(core.app)
    response = client.post("/repositories/audit", json={"source_url": "https://github.com/example/repo"})
    assert response.status_code == 200
    report_id = response.json()["id"]
    detail = client.get(f"/repositories/reports/{report_id}")
    assert detail.status_code == 200
    assert detail.json()["id"] == report_id
    assert detail.json()["static_audit"] == "pending"
    assert 'blocked' in detail.json()["audit_report"]
    second = client.post("/repositories/audit", json={"source_url": "https://huggingface.co/example/model"})
    assert second.status_code == 200
    listing = client.get("/repositories/reports")
    assert listing.status_code == 200
    rows = listing.json()
    assert [row["id"] for row in rows] == sorted([row["id"] for row in rows], reverse=True)
print("repository HTTP integration tests passed")
