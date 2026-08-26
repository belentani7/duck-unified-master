import sys
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import backend.main as core

class Cursor:
    lastrowid = 42
    def fetchone(self): return {"id": 42, "name": "https://github.com/example/repo", "format": "repository", "static_audit": "pending", "manually_approved": 0, "audit_report": '{"execution":"blocked"}'}
    def fetchall(self): return [self.fetchone()]
class Conn:
    def __enter__(self): return self
    def __exit__(self, *args): pass
    def execute(self, *args): return Cursor()

with patch.object(core, "connect", return_value=Conn()):
    created = core.audit_repository_url(core.RepositoryAuditIn(source_url="https://github.com/example/repo"))
    assert created["id"] == 42
    assert created["audit_report"]["execution"] == "blocked"
    assert created["audit_report"]["manualApprovalRequired"] is True
    stored = core.plugin_report(created["id"])
    assert stored["id"] == created["id"]
    assert stored["manually_approved"] == 0
    dedicated = core.repository_report(created["id"])
    assert dedicated["id"] == created["id"]
    listed = core.repository_reports()
    assert listed[0]["format"] == "repository"
print("repository endpoint readback tests passed")
