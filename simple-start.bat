@echo off
echo Simple Waya's Wheel Startup
echo ==========================

echo Killing any existing processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Starting Backend Server...
start "Backend" cmd /c "cd server && npm run dev && pause"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start "Frontend" cmd /c "cd client && npm start && pause"

echo.
echo Both servers should be starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Wait 30 seconds for full startup...
timeout /t 30 /nobreak >nul

echo Opening browser...
start http://localhost:3000

echo.
echo If the frontend doesn't work, try:
echo 1. Run diagnose.bat first
echo 2. Check for errors in the server windows
echo 3. Try manual startup in separate terminals
pause
