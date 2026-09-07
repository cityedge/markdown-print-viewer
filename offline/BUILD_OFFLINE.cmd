@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0build_offline.ps1"
if errorlevel 1 (
  echo.
  echo Offline build failed.
  pause
  exit /b 1
)
echo.
echo Done. You can now open offline\index.html without a network connection.
pause
