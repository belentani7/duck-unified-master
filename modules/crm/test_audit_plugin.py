import json
import tempfile
from pathlib import Path
from audit_plugin import audit

with tempfile.TemporaryDirectory() as directory:
    root = Path(directory)
    (root / "package.json").write_text(json.dumps({"dependencies": {"react": "19"}}), encoding="utf-8")
    (root / "LICENSE").write_text("MIT License", encoding="utf-8")
    result = audit(root)
    assert "react" in result["dependencies"]
    assert "mit" in result["licenses"]
    assert result["status"] == "manual_review_required"
print("audit plugin tests passed")
