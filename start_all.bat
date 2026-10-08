@echo off
title Disco Duro Radio - Launcher
echo ============================================
echo   DISCO DURO RADIO - LAUNCHER
echo ============================================
echo.
echo Iniciando FRONTEND...
start "DDR Frontend" cmd /k "%~dp0start_frontend.bat"

echo Iniciando BACKEND (placeholder)...
start "DDR Backend" cmd /k "%~dp0start_backend.bat"

echo.
echo Ambos procesos fueron lanzados en ventanas separadas.
pause
