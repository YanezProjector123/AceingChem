@echo off
REM This batch file starts the React app and opens it in the default browser

:: Start the React development server in a new window
start cmd /k "npm start"

:: Wait a few seconds for the server to start (adjust if needed)
timeout /t 5 /nobreak >nul

:: Open the web app in the default browser
start http://localhost:3000

echo.
echo The app should now be running in your browser.
pause
