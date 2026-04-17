@echo off
echo Restarting Waya's Wheel of Regret Development Servers
echo =================================================

echo Killing existing processes on ports 3000 and 5000...
npx kill-port 3000 >nul 2>&1
npx kill-port 5000 >nul 2>&1
timeout /t 2 /nobreak >nul

echo Cleaning up...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd client && npm start"

echo.
echo Both servers are restarting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Wait 10 seconds for servers to fully start...
timeout /t 10 /nobreak >nul

echo Opening browser...
start http://localhost:3000

echo.
echo Development servers are running!
echo Press Ctrl+C in each server window to stop
pause
