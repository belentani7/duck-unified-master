$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host '== DUCK.OS :: build web ==' -ForegroundColor Green
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build

Write-Host '== DUCK.OS :: freeze local backend ==' -ForegroundColor Green
pyinstaller --onefile --name duckos-core (Join-Path $Root 'backend/main.py') --distpath (Join-Path $Root 'backend/dist') --workpath (Join-Path $Root 'backend/build') --specpath (Join-Path $Root 'backend') --clean

Write-Host '== DUCK.OS :: build desktop ==' -ForegroundColor Green
Set-Location (Join-Path $Root 'desktop')
pnpm install
pnpm dist

Write-Host 'Installer ready in desktop/release/' -ForegroundColor Green
