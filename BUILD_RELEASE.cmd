@echo off
setlocal
where pwsh.exe >nul 2>&1
if errorlevel 1 (
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\build_release.ps1"
) else (
  pwsh.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\build_release.ps1"
)
if errorlevel 1 (
  echo Release build failed.
  pause
  exit /b 1
)
echo Release ZIP files are in dist.
pause
