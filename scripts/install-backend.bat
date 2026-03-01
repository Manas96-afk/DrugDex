@echo off
echo ========================================
echo MediView Backend Installation
echo ========================================
echo.

cd ..\backend

echo Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Make sure Node.js and npm are installed
    pause
    exit /b 1
)

echo.
echo Installing nodemon globally...
call npm install -g nodemon

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Warning: Could not install nodemon globally
    echo You can still use: npm start
)

echo.
echo Creating .env file...
if not exist .env (
    copy .env.example .env
    echo .env file created successfully
) else (
    echo .env file already exists
)

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo To start the server, run:
echo   scripts\start-backend.bat
echo.
echo The server will run on http://localhost:5000
echo.
pause
