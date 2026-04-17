# Manual Startup Guide

## If Automatic Scripts Fail - Follow These Steps

### Step 1: Clean Environment
```bash
# Navigate to project
cd C:\Users\steur\Desktop\WayaWheelWebApp

# Kill all Node processes
taskkill /F /IM node.exe

# Clear cache
npm cache clean --force
```

### Step 2: Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies  
cd server
npm install
cd ..
```

### Step 3: Start Backend (Terminal 1)
```bash
cd server
npm run dev
```

### Step 4: Start Frontend (Terminal 2)
```bash
# Open NEW terminal window
cd client
npm start
```

### Step 5: Test Access
- Backend: http://localhost:5000/api/health
- Frontend: http://localhost:3000

## Common Issues & Solutions

### "allowedHosts[0] should be a non-empty string"
```bash
# In client folder, create/edit .env file:
cd client
echo "HOST=localhost" > .env
echo "PORT=3000" >> .env
echo "REACT_APP_API_URL=http://localhost:5000" >> .env
```

### "Port already in use"
```bash
# Kill processes on ports
npx kill-port 3000
npx kill-port 5000
```

### Module not found errors
```bash
# Reinstall everything
rmdir /s /q node_modules
rmdir /s /q client\node_modules
rmdir /s /q server\node_modules
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### Frontend shows blank page
1. Check browser console (F12) for errors
2. Ensure backend is running on port 5000
3. Try different browser
4. Clear browser cache (Ctrl+Shift+Delete)

### Backend fails to start
1. Check if port 5000 is free
2. Verify Node.js version: `node --version` (should be 16+)
3. Check server/.env file exists

## Quick Test Commands
```bash
# Test backend
curl http://localhost:5000/api/health

# Test frontend (should show React app)
curl http://localhost:3000
```

## Expected Output

### Backend Should Show:
```
ð Waya's Wheel of Regret Server running on port 5000
ð Environment: development
ð Health check: http://localhost:5000/api/health
```

### Frontend Should Show:
- React development server starts
- Opens browser to http://localhost:3000
- Shows Waya's Wheel of Regret interface

## Still Not Working?
1. Run `diagnose.bat` first
2. Try `simple-start.bat`
3. Follow manual steps above
4. Check Node.js version: `node --version`
5. Restart computer (clears port locks)
