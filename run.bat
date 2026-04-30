@echo off
setlocal

set "ROOT=%~dp0"
set "CLIENT=%ROOT%client"
set "SERVER=%ROOT%server"

echo Starting MedHealth server...
start "MedHealth Server" cmd /k "cd /d ""%SERVER%"" && npm.cmd run dev"

echo Starting MedHealth client...
start "MedHealth Client" cmd /k "cd /d ""%CLIENT%"" && npm.cmd run dev -- --port 5173 --strictPort"

start "" "http://localhost:5173"

endlocal