@echo off
setlocal
title Disco Duro Radio - Frontend
set PORT=5173
set DIR=%~dp0frontend

echo ============================================
echo   DISCO DURO RADIO - MOCKUP FRONTEND
echo   Sirviendo: %DIR%
echo   URL: http://localhost:%PORT%
echo ============================================
echo.

where python >nul 2>nul
if %ERRORLEVEL%==0 (
    start "" http://localhost:%PORT%/index.html
    cd /d "%DIR%"
    python -m http.server %PORT%
    goto :eof
)

where py >nul 2>nul
if %ERRORLEVEL%==0 (
    start "" http://localhost:%PORT%/index.html
    cd /d "%DIR%"
    py -m http.server %PORT%
    goto :eof
)

echo No se encontro Python instalado en el PATH.
echo Instala Python ^(https://www.python.org/downloads/^) o abre
echo manualmente el archivo frontend\index.html en tu navegador.
pause
