@echo off
setlocal
where pwsh.exe >nul 2>&1
if errorlevel 1 (
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0build_offline.ps1"
) else (
  pwsh.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0build_offline.ps1"
)
if errorlevel 1 (
  echo.
  echo Offline build failed.
  pause
  exit /b 1
)
echo.
echo Done. You can now open offline\index.html without a network connection.
pause
