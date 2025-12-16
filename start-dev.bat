@echo off
REM start-dev.bat - launches backend and frontend in separate Windows terminals
REM Edit the REPO variable below if your project path is different.

set REPO=C:\Users\Admin\DohaEducationHub

echo Starting backend in a new window...
start "Backend" cmd /k "cd /d %REPO%\backend && %REPO%\backend\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000"

echo Starting frontend in a new window...
start "Frontend" cmd /k "cd /d %REPO%\frontend && npm run dev"

echo Both processes started. Close these windows to stop the servers.
pause
