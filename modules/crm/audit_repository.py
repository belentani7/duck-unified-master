from __future__ import annotations
import json
import re
from pathlib import Path
from urllib.parse import urlparse

ALLOWED_HOSTS = {"github.com", "www.github.com", "huggingface.co", "www.huggingface.co"}
SUSPICIOUS = re.compile(r"\b(eval|exec|subprocess|os\.system|child_process|powershell|curl\s+\|)\b", re.I)

def validate_repository_url(url: str) -> dict:
    parsed = urlparse(url)
    host = (parsed.hostname or "").lower()
    allowed = parsed.scheme == "https" and host in ALLOWED_HOSTS and len(parsed.path.strip("/ ").split("/")) >= 2
    return {"url": url, "allowed": allowed, "host": host, "reason": "static-review-only" if allowed else "unsupported-or-invalid-repository-url"}

def audit_repository_tree(root: str | Path) -> dict:
    base = Path(root).resolve()
    files = []
    suspicious = []
    manifests = []
    for path in base.rglob("*"):
        if not path.is_file() or ".git" in path.parts or len(files) >= 5000:
            continue
        rel = str(path.relative_to(base))
        files.append(rel)
        if path.name in {"package.json", "requirements.txt", "pyproject.toml", "Cargo.toml", "go.mod"}:
            manifests.append(rel)
        try:
            if path.stat().st_size <= 1_000_000 and SUSPICIOUS.search(path.read_text(errors="ignore")):
                suspicious.append(rel)
        except OSError:
            continue
    return {"root": str(base), "filesScanned": len(files), "manifests": manifests, "suspiciousFiles": suspicious, "manualApprovalRequired": True, "execution": "blocked"}

def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("path")
    parser.add_argument("--url")
    args = parser.parse_args()
    report = audit_repository_tree(args.path)
    if args.url:
        report["source"] = validate_repository_url(args.url)
    print(json.dumps(report, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
