@echo off
REM This batch file installs dependencies, starts the React app, and opens Google Chrome to the deployed web app link

:: Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Opening the Node.js download page...
    start https://nodejs.org/en/download/
    pause
    exit /b
)

:: Install dependencies
npm install

:: Start the React development server
start cmd /k "npm start"

:: Wait a few seconds for the server to start (adjust if needed)
timeout /t 5 /nobreak >nul

:: Open Google Chrome to the web app URL (replace with your actual deployed link)
start chrome https://your-app-link.netlify.app/
