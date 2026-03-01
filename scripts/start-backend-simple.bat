@echo off
echo ========================================
echo Starting MediView Backend Server
echo ========================================
echo.

cd ..\backend

if not exist node_modules (
    echo ERROR: Dependencies not installed
    echo Please run install-backend.bat first
    echo.
    pause
    exit /b 1
)

if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
)

echo Starting server...
echo Server will run on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

node server.js
