import json
import sys
import tempfile
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from audit_repository import audit_repository_tree, validate_repository_url

assert validate_repository_url("https://github.com/example/repo")["allowed"]
assert validate_repository_url("https://huggingface.co/example/model")["allowed"]
assert not validate_repository_url("http://evil.example/repo")["allowed"]
with tempfile.TemporaryDirectory() as folder:
    root = Path(folder); (root / "package.json").write_text("{}")
    (root / "setup.py").write_text("import subprocess\n")
    report = audit_repository_tree(root)
    assert report["filesScanned"] == 2
    assert "package.json" in report["manifests"]
    assert "setup.py" in report["suspiciousFiles"]
    assert report["execution"] == "blocked"
print("repository audit tests passed")
