@echo off
REM This batch file installs Node.js if missing and runs npm install for the project

:: Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Opening the Node.js download page...
    start https://nodejs.org/en/download/
    pause
    exit /b
)

echo Installing npm dependencies...
npm install
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] npm install failed! Please check the error messages above.
    pause
    exit /b
)
echo.
echo All dependencies installed successfully!
pause
