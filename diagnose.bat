@echo off
echo Diagnosing Waya's Wheel of Regret Setup Issues
echo ===============================================

echo Checking Node.js installation...
node --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo.
echo Checking npm installation...
npm --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed
    pause
    exit /b 1
)

echo.
echo Checking project structure...
if not exist "package.json" (
    echo ERROR: Root package.json not found
    pause
    exit /b 1
)

if not exist "client\package.json" (
    echo ERROR: Client package.json not found
    pause
    exit /b 1
)

if not exist "server\package.json" (
    echo ERROR: Server package.json not found
    pause
    exit /b 1
)

echo.
echo Checking node_modules...
if not exist "node_modules" (
    echo Installing root dependencies...
    npm install
)

if not exist "client\node_modules" (
    echo Installing client dependencies...
    cd client
    npm install
    cd ..
)

if not exist "server\node_modules" (
    echo Installing server dependencies...
    cd server
    npm install
    cd ..
)

echo.
echo Checking for port conflicts...
netstat -an | findstr :3000
if %ERRORLEVEL% EQU 0 (
    echo Port 3000 is in use, killing process...
    npx kill-port 3000
)

netstat -an | findstr :5000
if %ERRORLEVEL% EQU 0 (
    echo Port 5000 is in use, killing process...
    npx kill-port 5000
)

echo.
echo Checking environment files...
if not exist "client\.env" (
    echo Creating client .env file...
    echo REACT_APP_API_URL=http://localhost:5000 > client\.env
    echo HOST=localhost >> client\.env
    echo PORT=3000 >> client\.env
)

if not exist "server\.env" (
    echo Creating server .env file...
    echo PORT=5000 > server\.env
    echo NODE_ENV=development >> server\.env
    echo CLIENT_URL=http://localhost:3000 >> server\.env
)

echo.
echo Diagnostics complete!
echo Now run: simple-start.bat
pause
