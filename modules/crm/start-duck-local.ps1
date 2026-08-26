$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$Backend = Join-Path $Root 'backend'

if (-not (Get-Command python -ErrorAction SilentlyContinue)) { throw 'Python 3.11+ não encontrado.' }
if (-not (Test-Path (Join-Path $Backend '.venv'))) { python -m venv (Join-Path $Backend '.venv') }
& (Join-Path $Backend '.venv/Scripts/python.exe') -m pip install -r (Join-Path $Backend 'requirements.txt')
Start-Process -FilePath (Join-Path $Backend '.venv/Scripts/python.exe') -ArgumentList '-m uvicorn main:app --host 127.0.0.1 --port 8765' -WorkingDirectory $Backend
$env:DUCK_DEV_URL = 'http://localhost:3000'
pnpm --dir $Root dev
