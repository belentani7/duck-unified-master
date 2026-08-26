from __future__ import annotations

import argparse
import hashlib
import json
import re
import tomllib
from pathlib import Path

LICENSE_NAMES = {"mit", "apache", "gpl", "bsd", "isc", "mpl", "lgpl", "unknown"}
SUSPICIOUS = re.compile(r"(powershell|invoke-webrequest|curl\s|wget\s|chmod\s\+x|subprocess|os\.system|eval\(|exec\()", re.I)


def parse_dependencies(item: Path) -> list[str]:
    try:
        if item.name == "package.json":
            data = json.loads(item.read_text(encoding="utf-8"))
            return sorted({*data.get("dependencies", {}), *data.get("devDependencies", {}), *data.get("peerDependencies", {})})
        if item.name == "pyproject.toml":
            data = tomllib.loads(item.read_text(encoding="utf-8"))
            project = data.get("project", {})
            return sorted(project.get("dependencies", []))
        if item.name == "requirements.txt":
            return sorted(line.strip() for line in item.read_text(encoding="utf-8").splitlines() if line.strip() and not line.startswith(("#", "-")))
    except (OSError, ValueError, tomllib.TOMLDecodeError):
        return []
    return []


def audit(path: Path) -> dict:
    files = [item for item in path.rglob("*") if item.is_file()]
    digest = hashlib.sha256()
    total = 0
    suspicious = []
    licenses = set()
    dependency_files = []
    dependencies = []
    for item in files:
        data = item.read_bytes()
        digest.update(data)
        total += len(data)
        if item.name.lower() in {"license", "copying", "license.md", "license.txt"}:
            text = data[:100_000].decode("utf-8", errors="ignore").lower()
            licenses.update(name for name in LICENSE_NAMES if name in text)
        if item.name.lower() in {"package.json", "requirements.txt", "pyproject.toml"}:
            dependency_files.append(str(item.relative_to(path)))
            dependencies.extend(parse_dependencies(item))
        if item.suffix.lower() in {".py", ".js", ".ts", ".ps1", ".bat", ".sh"}:
            text = data[:250_000].decode("utf-8", errors="ignore")
            if SUSPICIOUS.search(text): suspicious.append(str(item.relative_to(path)))
    return {"path": str(path), "files": len(files), "bytes": total, "sha256": digest.hexdigest(), "licenses": sorted(licenses or {"unknown"}), "dependency_files": dependency_files, "dependencies": sorted(set(dependencies)), "suspicious_files": suspicious, "status": "manual_review_required"}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Auditoria estática DuckOS — nunca executa o repositório")
    parser.add_argument("path", type=Path)
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()
    result = audit(args.path)
    output = json.dumps(result, ensure_ascii=False, indent=2)
    if args.out: args.out.write_text(output, encoding="utf-8")
    else: print(output)
