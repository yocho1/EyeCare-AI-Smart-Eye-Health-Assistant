param(
    [switch]$Deep
)

Write-Host "Cleaning workspace..." -ForegroundColor Cyan
$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
Push-Location $root

# Helpers
function Remove-Glob($pattern) {
    Get-ChildItem -Recurse -Force -ErrorAction SilentlyContinue -Path $pattern | ForEach-Object {
        try {
            if ($_.PSIsContainer) { Remove-Item $_.FullName -Recurse -Force -ErrorAction SilentlyContinue }
            else { Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue }
        } catch { }
    }
}

# Python caches and reports
Remove-Glob "**/__pycache__"
Remove-Glob "**/*.pyc"
Remove-Glob "**/*.pyo"
Remove-Glob "**/.pytest_cache"
Remove-Glob "**/.coverage"
Remove-Glob "**/htmlcov"

# Logs
Remove-Glob "**/*.log"
Remove-Glob "**/logs"

# Frontend build caches
Remove-Glob "frontend/dist"
Remove-Glob "frontend/build"
Remove-Glob "frontend/.vite"

# OS/editor junk
Remove-Glob "**/.DS_Store"
Remove-Glob "**/Thumbs.db"

if ($Deep) {
    Write-Host "Deep cleaning enabled: removing node_modules and venv" -ForegroundColor Yellow
    Remove-Glob "frontend/node_modules"
    Remove-Glob "**/node_modules"
    Remove-Glob ".venv"
    Remove-Glob "venv"
}

Pop-Location
Write-Host "Clean complete." -ForegroundColor Green
