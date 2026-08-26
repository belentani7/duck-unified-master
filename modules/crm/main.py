from __future__ import annotations

import hashlib
import json
import queue
import sqlite3
import threading
import time
from pathlib import Path
from typing import Any

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

ROOT = Path.home() / "DuckOS" / "data"
ROOT.mkdir(parents=True, exist_ok=True)
DELIVERY_ROOT = ROOT / "deliveries"
DELIVERY_ROOT.mkdir(parents=True, exist_ok=True)
DB = ROOT / "duckos.sqlite3"
TASKS: queue.Queue[dict[str, Any]] = queue.Queue()
TASK_STATUS: dict[str, dict[str, Any]] = {}

app = FastAPI(title="DuckOS Local Core", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://localhost:3000"], allow_methods=["*"], allow_headers=["*"])


def connect():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with connect() as conn:
        conn.executescript("""
        CREATE TABLE IF NOT EXISTS clients (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT, status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY, client_id INTEGER, name TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active', progress INTEGER NOT NULL DEFAULT 0, participation REAL NOT NULL DEFAULT 100, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(client_id) REFERENCES clients(id));
        CREATE TABLE IF NOT EXISTS memories (client_id INTEGER PRIMARY KEY, notes TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(client_id) REFERENCES clients(id));
        CREATE TABLE IF NOT EXISTS plugins (id INTEGER PRIMARY KEY, name TEXT NOT NULL, format TEXT NOT NULL, license TEXT, sha256 TEXT NOT NULL, static_audit TEXT NOT NULL DEFAULT 'pending', manually_approved INTEGER NOT NULL DEFAULT 0, dependencies TEXT NOT NULL DEFAULT '[]');
        CREATE TABLE IF NOT EXISTS notifications (id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT NOT NULL, message TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
        """)


def worker():
    while True:
        task = TASKS.get()
        task_id = task["id"]
        TASK_STATUS[task_id] = {"id": task_id, "kind": task.get("kind", "generic"), "label": task["label"], "state": "processando", "status": "processing", "progress": 5}
        if task.get("force_error"):
            TASK_STATUS[task_id]["state"] = "erro"
            TASK_STATUS[task_id]["status"] = "error"
            TASKS.task_done()
            continue
        for progress in (22, 48, 72, 100):
            time.sleep(0.15)
            TASK_STATUS[task_id]["progress"] = progress
        TASK_STATUS[task_id]["state"] = "concluído"
        TASK_STATUS[task_id]["status"] = "completed"
        if task.get("kind") == "audio_analysis": TASK_STATUS[task_id]["result"] = {"message": "Arquivo pronto para consulta DSP"}
        TASKS.task_done()


init_db()
threading.Thread(target=worker, daemon=True, name="duck-worker").start()


class ClientIn(BaseModel):
    name: str
    email: str | None = None
    status: str = "active"


class ProjectIn(BaseModel):
    name: str
    client_id: int | None = None
    status: str = "active"
    progress: int = 0
    participation: float = 100


class MemoryIn(BaseModel):
    notes: str


def add_notification(kind: str, message: str):
    with connect() as conn:
        conn.execute("INSERT INTO notifications(kind,message) VALUES(?,?)", (kind, message))

@app.get("/notifications")
def notifications():
    with connect() as conn:
        return [dict(row) for row in conn.execute("SELECT * FROM notifications ORDER BY id DESC LIMIT 30")]

@app.get("/health")
def health():
    return {"status": "ok", "mode": "local-offline", "database": str(DB)}


@app.get("/clients")
def clients():
    with connect() as conn:
        return [dict(row) for row in conn.execute("SELECT * FROM clients ORDER BY name")]


@app.post("/clients")
def create_client(item: ClientIn):
    with connect() as conn:
        cur = conn.execute("INSERT INTO clients(name,email,status) VALUES(?,?,?)", (item.name, item.email, item.status))
        return {"id": cur.lastrowid, **item.model_dump()}


@app.get("/projects")
def projects():
    with connect() as conn:
        return [dict(row) for row in conn.execute("SELECT p.*, c.name AS client_name FROM projects p LEFT JOIN clients c ON c.id=p.client_id ORDER BY p.created_at DESC")]


@app.post("/projects")
def create_project(item: ProjectIn):
    with connect() as conn:
        cur = conn.execute("INSERT INTO projects(name,client_id,status,progress,participation) VALUES(?,?,?,?,?)", (item.name, item.client_id, item.status, item.progress, item.participation))
        return {"id": cur.lastrowid, **item.model_dump()}


@app.get("/clients/{client_id}/memory")
def get_memory(client_id: int):
    with connect() as conn:
        row = conn.execute("SELECT * FROM memories WHERE client_id=?", (client_id,)).fetchone()
        return dict(row) if row else {"client_id": client_id, "notes": ""}


@app.put("/clients/{client_id}/memory")
def save_memory(client_id: int, item: MemoryIn):
    with connect() as conn:
        conn.execute("INSERT INTO memories(client_id,notes) VALUES(?,?) ON CONFLICT(client_id) DO UPDATE SET notes=excluded.notes, updated_at=CURRENT_TIMESTAMP", (client_id, item.notes))
        return {"client_id": client_id, "notes": item.notes, "saved": True}


@app.post("/tasks")
def create_task(label: str = "Análise de áudio"):
    task_id = hashlib.sha1(f"{label}{time.time()}".encode()).hexdigest()[:12]
    TASKS.put({"id": task_id, "label": label})
    return {"id": task_id, "state": "fila", "progress": 0}


@app.get("/tasks")
def tasks():
    return list(TASK_STATUS.values())

@app.post("/audio/tasks")
def create_audio_task(simulate_error: bool = False):
    task_id = hashlib.sha1(f"audio-analysis{time.time()}".encode()).hexdigest()[:12]
    TASKS.put({"id": task_id, "kind": "audio_analysis", "label": "Análise de áudio", "force_error": simulate_error})
    return {"id": task_id, "kind": "audio_analysis", "state": "fila", "status": "queued", "progress": 0}

@app.get("/audio/tasks")
def audio_tasks():
    return [item for item in TASK_STATUS.values() if item.get("kind") == "audio_analysis"]


@app.post("/deliveries/upload")
def upload_delivery(file: UploadFile = File(...), project_id: int = 0, version: str = "draft"):
    safe_name = Path(file.filename or "delivery.bin").name
    destination = DELIVERY_ROOT / f"{int(time.time())}_{safe_name}"
    data = file.file.read()
    destination.write_bytes(data)
    add_notification("delivery", f"Nova versão {version} enviada: {safe_name}")
    return {"projectId": project_id, "version": version, "fileName": safe_name, "filePath": str(destination), "sha256": hashlib.sha256(data).hexdigest(), "status": "review"}


@app.post("/plugins/audit")
def audit_plugin(file: UploadFile = File(...)):
    data = file.file.read()
    digest = hashlib.sha256(data).hexdigest()
    with connect() as conn:
        report = {"filename": file.filename, "sha256": digest, "license": "unknown", "dependencies": [], "static_audit": "pending", "manual_review_required": True}
        cur = conn.execute("INSERT INTO plugins(name,format,license,sha256,static_audit,dependencies,audit_report) VALUES(?,?,?,?,?,?,?)", (file.filename, Path(file.filename).suffix.lstrip("."), "unknown", digest, "pending", json.dumps([]), json.dumps(report)))
        return {"id": cur.lastrowid, **report, "manually_approved": False}


@app.post("/plugins/{plugin_id}/approve")
def approve_plugin(plugin_id: int):
    with connect() as conn:
        updated = conn.execute("UPDATE plugins SET static_audit='passed', manually_approved=1 WHERE id=?", (plugin_id,)).rowcount
    if updated == 0:
        return {"id": plugin_id, "status": "not_found"}
    add_notification("plugin", f"Plugin {plugin_id} aprovado manualmente")
    return {"id": plugin_id, "status": "approved"}


@app.post("/audio/analyze")
def analyze_audio(file: UploadFile = File(...)):
    """Real file analysis path; dependencies are optional and errors are returned explicitly."""
    import tempfile
    try:
        import librosa
        import soundfile as sf
        import numpy as np
    except ImportError as exc:
        return {"status": "unavailable", "reason": f"Instale o pacote DSP opcional: {exc}"}
    suffix = Path(file.filename or "audio.wav").suffix or ".wav"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as handle:
        handle.write(file.file.read())
        temp_path = handle.name
    try:
        data, sample_rate = sf.read(temp_path, always_2d=False)
        mono = data.mean(axis=1) if getattr(data, "ndim", 1) > 1 else data
        rms = float(np.sqrt(np.mean(np.square(mono))))
        y, sr = librosa.load(temp_path, sr=22050, mono=True)
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
        keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
        key = keys[int(np.argmax(np.mean(chroma, axis=1)))]
        lufs = None
        try:
            import pyloudnorm as pyln
            lufs = float(pyln.Meter(sample_rate).integrated_loudness(data))
        except Exception:
            pass
        return {"status": "ok", "filename": file.filename, "rms": rms, "peak_db": float(20 * np.log10(max(np.max(np.abs(mono)), 1e-9))), "lufs": lufs, "bpm": float(np.asarray(tempo).reshape(-1)[0]), "key": key, "duration": float(len(y) / sr)}
    finally:
        Path(temp_path).unlink(missing_ok=True)


@app.post("/assistant/complete")
def assistant_complete(messages: list[dict[str, str]]):
    from ai_adapters import OptionalAIAdapter
    return OptionalAIAdapter().complete(messages)


class RepositoryAuditIn(BaseModel):
    source_url: str

@app.post("/repositories/audit")
def audit_repository_url(item: RepositoryAuditIn):
    from scripts.audit_repository import validate_repository_url
    source = validate_repository_url(item.source_url)
    report = {"source": source, "mode": "metadata-only", "manualApprovalRequired": True, "execution": "blocked", "suspiciousFiles": [], "manifests": [], "filesScanned": 0}
    digest = hashlib.sha256(item.source_url.encode()).hexdigest()
    with connect() as conn:
        cur = conn.execute("INSERT INTO plugins(name,format,license,sha256,static_audit,dependencies,audit_report) VALUES(?,?,?,?,?,?,?)", (item.source_url, "repository", "unknown", digest, "pending", json.dumps([]), json.dumps(report)))
        return {"id": cur.lastrowid, "name": item.source_url, "sha256": digest, "static_audit": "pending", "manually_approved": 0, "audit_report": report}


class APIKeyCheck(BaseModel):
    provider: str
    api_key: str


@app.post("/assistant/config/validate")
def validate_api_key(item: APIKeyCheck):
    valid = item.provider == "openai" and len(item.api_key.strip()) >= 20
    return {"provider": item.provider, "valid": valid, "stored": False, "message": "Chave validada apenas em memória; configure DUCK_OPENAI_API_KEY no ambiente para uso persistente." if valid else "Formato de chave inválido."}


try:
    with connect() as conn:
        conn.execute("ALTER TABLE plugins ADD COLUMN audit_report TEXT")
except sqlite3.OperationalError:
    pass

@app.get("/repositories/reports")
def repository_reports():
    with connect() as conn:
        rows = conn.execute("SELECT id,name,format,license,sha256,static_audit,manually_approved,dependencies,audit_report FROM plugins WHERE format='repository' ORDER BY id DESC").fetchall()
        return [dict(row) for row in rows]

@app.get("/repositories/reports/{report_id}")
def repository_report(report_id: int):
    with connect() as conn:
        row = conn.execute("SELECT id,name,format,license,sha256,static_audit,manually_approved,dependencies,audit_report FROM plugins WHERE id=? AND format='repository'", (report_id,)).fetchone()
        return dict(row) if row else {"error": "repository_report_not_found"}

@app.get("/plugins/{plugin_id}/report")
def plugin_report(plugin_id: int):
    with connect() as conn:
        row = conn.execute("SELECT id,name,format,license,sha256,static_audit,manually_approved,dependencies,audit_report FROM plugins WHERE id=?", (plugin_id,)).fetchone()
        return dict(row) if row else {"error": "plugin_not_found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8765, log_level="warning")
